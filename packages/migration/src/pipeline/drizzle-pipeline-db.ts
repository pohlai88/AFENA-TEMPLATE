import { and, eq, isNull, sql } from 'drizzle-orm';

import type { DbInstance } from 'afena-database';
import { migrationLineage } from 'afena-database';

import type { EntityType } from '../types/migration-job.js';
import type { PipelineDb } from './pipeline-base.js';

/**
 * Concrete PipelineDb backed by Drizzle ORM + Neon Postgres.
 *
 * Fix 1: Lineage State Machine
 * - insertLineageReservation → INSERT … ON CONFLICT DO NOTHING RETURNING
 * - reclaimStaleReservation  → single-statement UPDATE … RETURNING (D0.1)
 * - commitLineage            → state transition reserved → committed
 * - deleteReservation        → by lineageId only (D0.2)
 */
export class DrizzlePipelineDb implements PipelineDb {
  constructor(private readonly db: DbInstance) {}

  async insertLineageReservation(params: {
    id: string;
    orgId: string;
    migrationJobId: string;
    entityType: EntityType;
    legacyId: string;
    legacySystem: string;
    reservedBy: string;
  }): Promise<{ id: string } | null> {
    const inserted = await this.db
      .insert(migrationLineage)
      .values({
        id: params.id,
        orgId: params.orgId,
        migrationJobId: params.migrationJobId,
        entityType: params.entityType,
        legacyId: params.legacyId,
        legacySystem: params.legacySystem,
        afenaId: null,
        state: 'reserved',
        reservedAt: new Date(),
        reservedBy: params.reservedBy,
      })
      .onConflictDoNothing()
      .returning({ id: migrationLineage.id });

    if (inserted.length > 0) {
      return { id: inserted[0]!.id };
    }
    return null;
  }

  async reclaimStaleReservation(params: {
    orgId: string;
    entityType: EntityType;
    legacySystem: string;
    legacyId: string;
    migrationJobId: string;
    reservedBy: string;
    expiryThreshold: Date;
  }): Promise<{ id: string } | null> {
    // D0.1: Single-statement atomic reclaim
    const claimed = await this.db
      .update(migrationLineage)
      .set({
        reservedAt: new Date(),
        reservedBy: params.reservedBy,
        migrationJobId: params.migrationJobId,
      })
      .where(
        and(
          eq(migrationLineage.orgId, params.orgId),
          eq(migrationLineage.entityType, params.entityType),
          eq(migrationLineage.legacySystem, params.legacySystem),
          eq(migrationLineage.legacyId, params.legacyId),
          eq(migrationLineage.state, 'reserved'),
          sql`${migrationLineage.reservedAt} < ${params.expiryThreshold}`,
          isNull(migrationLineage.afenaId)
        )
      )
      .returning({ id: migrationLineage.id });

    if (claimed.length > 0) {
      return { id: claimed[0]!.id };
    }
    return null;
  }

  async commitLineage(lineageId: string, afenaId: string): Promise<boolean> {
    const updated = await this.db
      .update(migrationLineage)
      .set({
        afenaId,
        state: 'committed',
        committedAt: new Date(),
      })
      .where(
        and(
          eq(migrationLineage.id, lineageId),
          eq(migrationLineage.state, 'reserved')
        )
      )
      .returning({ id: migrationLineage.id });

    return updated.length > 0;
  }

  // D0.2: Delete only by lineageId (never by composite key)
  async deleteReservation(lineageId: string): Promise<void> {
    await this.db
      .delete(migrationLineage)
      .where(eq(migrationLineage.id, lineageId));
  }
}
