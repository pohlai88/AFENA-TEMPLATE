import { and, eq } from 'drizzle-orm';

import type { DbInstance } from 'afena-database';
import {
  migrationJobs,
  migrationLineage,
  migrationRowSnapshots,
} from 'afena-database';

import type { EntityType } from '../types/migration-job.js';
import type { CrudBridge } from './crud-bridge.js';

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
 * @deprecated Use CrudBridge instead. Kept for backward compatibility.
 */
export type MutateFn = CrudBridge['mutate'];

/**
 * Rollback engine — restores entities from write-shape snapshots.
 *
 * Two-phase rollback:
 * 1. Delete newly created records (lineage with state='committed')
 * 2. Restore updated records from before_write_core + before_write_custom snapshots
 *
 * Uses CrudBridge.mutate() for all writes to maintain audit trail integrity.
 */
export class RollbackEngine {
  private readonly bridge: CrudBridge;

  constructor(
    private readonly db: DbInstance,
    bridge: CrudBridge,
  ) {
    this.bridge = bridge;
  }

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
        // Read current version for optimistic lock
        const currentRow = await this.bridge.readRawRow(entityType, row.afenaId);
        const currentVersion = currentRow
          ? (currentRow['version'] as number | undefined)
          : undefined;

        await this.bridge.mutate({
          actionType: `${entityType}.delete`,
          entityType,
          entityId: row.afenaId,
          input: {},
          expectedVersion: currentVersion,
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

        await this.bridge.mutate({
          actionType: `${entityType}.update`,
          entityType,
          entityId: snapshot.entityId,
          input: restoreData,
          expectedVersion: snapshot.beforeVersion ?? undefined,
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
