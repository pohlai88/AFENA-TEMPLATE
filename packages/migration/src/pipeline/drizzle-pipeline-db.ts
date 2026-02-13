import { and, eq, isNull, sql } from 'drizzle-orm';

import type { DbInstance } from 'afena-database';
import { migrationLineage } from 'afena-database';

import type { EntityType } from '../types/migration-job.js';
import type { PipelineDb } from './pipeline-base.js';

/**
 * OPS-05: Compute a deterministic dedupe key from the composite lineage fields.
 * Uses a simple hash: org_id|entity_type|legacy_system|legacy_id
 */
function computeDedupeKey(orgId: string, entityType: string, legacySystem: string, legacyId: string): string {
  return `${orgId}|${entityType}|${legacySystem}|${legacyId}`;
}

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
  constructor(private readonly db: DbInstance) { }

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
        dedupeKey: computeDedupeKey(params.orgId, params.entityType, params.legacySystem, params.legacyId),
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
      } as Record<string, unknown>)
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
  // Guard: only delete if still in 'reserved' state (never committed)
  async deleteReservation(lineageId: string): Promise<void> {
    await this.db
      .delete(migrationLineage)
      .where(
        and(
          eq(migrationLineage.id, lineageId),
          eq(migrationLineage.state, 'reserved')
        )
      );
  }

  // SPD-02: Batch lineage reservation — single INSERT for N rows
  async bulkInsertLineageReservations(params: Array<{
    id: string;
    orgId: string;
    migrationJobId: string;
    entityType: EntityType;
    legacyId: string;
    legacySystem: string;
    reservedBy: string;
  }>): Promise<Array<{ id: string; legacyId: string }>> {
    if (params.length === 0) return [];

    const now = new Date();
    const inserted = await this.db
      .insert(migrationLineage)
      .values(
        params.map((p) => ({
          id: p.id,
          orgId: p.orgId,
          migrationJobId: p.migrationJobId,
          entityType: p.entityType,
          legacyId: p.legacyId,
          legacySystem: p.legacySystem,
          afenaId: null,
          state: 'reserved',
          reservedAt: now,
          reservedBy: p.reservedBy,
          dedupeKey: computeDedupeKey(p.orgId, p.entityType, p.legacySystem, p.legacyId),
        }))
      )
      .onConflictDoNothing()
      .returning({ id: migrationLineage.id, legacyId: migrationLineage.legacyId });

    return inserted;
  }
}
