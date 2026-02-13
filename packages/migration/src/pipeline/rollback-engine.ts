import { and, eq } from 'drizzle-orm';

import type { DbInstance } from 'afena-database';
import {
  migrationJobs,
  migrationLineage,
  migrationRowSnapshots,
} from 'afena-database';

import type { EntityType } from '../types/migration-job.js';

/**
 * Rollback result for a single migration job.
 */
export interface RollbackResult {
  jobId: string;
  entityType: string;
  deletedCount: number;
  restoredCount: number;
  failedCount: number;
  errors: Array<{ entityId: string; error: string }>;
}

/**
 * Mutate function signature — injected to avoid direct crud dependency.
 * The caller provides the real mutate() from afena-crud at runtime.
 */
export type MutateFn = (params: {
  action: string;
  entity: { type: string; id?: string };
  data?: Record<string, unknown>;
  expectedVersion?: number | null;
}) => Promise<{ status: string; entityId?: string | null }>;

/**
 * Rollback engine — restores entities from write-shape snapshots.
 *
 * Two-phase rollback:
 * 1. Delete newly created records (lineage with state='committed')
 * 2. Restore updated records from before_write_core + before_write_custom snapshots
 *
 * Uses mutate() for all writes to maintain audit trail integrity.
 */
export class RollbackEngine {
  constructor(
    private readonly db: DbInstance,
    private readonly mutate: MutateFn,
    private readonly systemContext: { orgId: string; actorUserId: string }
  ) {}

  async rollback(jobId: string): Promise<RollbackResult> {
    // 1. Load job metadata
    const jobs = await this.db
      .select()
      .from(migrationJobs)
      .where(eq(migrationJobs.id, jobId));

    if (jobs.length === 0) {
      throw new Error(`Migration job '${jobId}' not found`);
    }

    const job = jobs[0]!;
    if (job.status === 'rolled_back') {
      throw new Error(`Migration job '${jobId}' already rolled back`);
    }

    const entityType = job.entityType as EntityType;
    const result: RollbackResult = {
      jobId,
      entityType,
      deletedCount: 0,
      restoredCount: 0,
      failedCount: 0,
      errors: [],
    };

    // 2. Delete newly created records (reverse lineage)
    const lineageRows = await this.db
      .select()
      .from(migrationLineage)
      .where(
        and(
          eq(migrationLineage.migrationJobId, jobId),
          eq(migrationLineage.state, 'committed')
        )
      );

    for (const row of lineageRows) {
      if (!row.afenaId) continue;

      try {
        await this.mutate({
          action: `${entityType}.delete`,
          entity: { type: entityType, id: row.afenaId },
          expectedVersion: null,
        });
        result.deletedCount++;
      } catch (error) {
        result.failedCount++;
        result.errors.push({
          entityId: row.afenaId,
          error: `Delete failed: ${String(error)}`,
        });
      }
    }

    // 3. Restore updated records from snapshots
    const snapshots = await this.db
      .select()
      .from(migrationRowSnapshots)
      .where(eq(migrationRowSnapshots.migrationJobId, jobId));

    for (const snapshot of snapshots) {
      try {
        // Reconstruct persistable data from write-shape snapshot
        const coreData = snapshot.beforeWriteCore as Record<string, unknown>;
        const customData = snapshot.beforeWriteCustom as Record<string, unknown>;

        const restoreData: Record<string, unknown> = {
          ...coreData,
          ...(Object.keys(customData).length > 0 ? { customData } : {}),
        };

        await this.mutate({
          action: `${entityType}.update`,
          entity: { type: entityType, id: snapshot.entityId },
          data: restoreData,
          expectedVersion: snapshot.beforeVersion,
        });

        result.restoredCount++;
      } catch (error) {
        result.failedCount++;
        result.errors.push({
          entityId: snapshot.entityId,
          error: `Restore failed: ${String(error)}`,
        });
      }
    }

    // 4. Mark job as rolled back
    await this.db
      .update(migrationJobs)
      .set({ status: 'rolled_back', completedAt: new Date() })
      .where(eq(migrationJobs.id, jobId));

    // 5. Clean up lineage for this job
    await this.db
      .delete(migrationLineage)
      .where(eq(migrationLineage.migrationJobId, jobId));

    return result;
  }
}
