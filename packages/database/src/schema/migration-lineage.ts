import { sql } from 'drizzle-orm';
import {
  check,
  index,
  pgTable,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

import { tenantPolicy } from '../helpers/tenant-policy';

import { migrationJobs } from './migration-jobs';
import { tenantPk, tenantFk, tenantFkIndex} from '../helpers/base-entity';

/**
 * Migration lineage — Fix 1: State Machine with atomic reservations.
 *
 * States: reserved → committed
 * - reserved: afenda_id IS NULL, reserved_at IS NOT NULL
 * - committed: afenda_id IS NOT NULL
 *
 * D0.1: Reclaim is single-statement atomic (UPDATE … RETURNING)
 * D0.2: Delete only by lineageId (never by composite key)
 */
export const migrationLineage = pgTable(
  'migration_lineage',
  {
    id: uuid('id').defaultRandom().notNull(),
    orgId: uuid('org_id').notNull(),
    migrationJobId: uuid('migration_job_id')
      .notNull(),
    entityType: text('entity_type').notNull(),
    legacyId: text('legacy_id').notNull(),
    legacySystem: text('legacy_system').notNull(),
    afendaId: uuid('afenda_id'),
    state: text('state').notNull().default('committed'),
    reservedAt: timestamp('reserved_at', { withTimezone: true }),
    reservedBy: text('reserved_by'),
    committedAt: timestamp('committed_at', { withTimezone: true }),
    migratedAt: timestamp('migrated_at', { withTimezone: true }).defaultNow().notNull(),
    dedupeKey: text('dedupe_key'),
  },
  (table) => [
    tenantPk(table),
    tenantFk(table, 'migration_job', table.migrationJobId, migrationJobs),
    tenantFkIndex(table, 'migration_job', table.migrationJobId),
    index('migration_lineage_job_idx').on(table.migrationJobId),
    index('migration_lineage_reservations_idx')
      .on(table.orgId, table.entityType, table.legacySystem, table.reservedAt)
      .where(sql`state = 'reserved'`),
    unique('migration_lineage_org_entity_legacy_uniq').on(
      table.orgId,
      table.entityType,
      table.legacySystem,
      table.legacyId,
    ),
    unique('migration_lineage_org_entity_afenda_uniq').on(
      table.orgId,
      table.entityType,
      table.afendaId,
    ),
    uniqueIndex('migration_lineage_dedupe_key_idx')
      .on(table.dedupeKey)
      .where(sql`state = 'committed' AND dedupe_key IS NOT NULL`),
    check('migration_lineage_state_chk', sql`state IN ('reserved', 'committed')`),
    check(
      'migration_lineage_reserved_requires_reserved_at',
      sql`state <> 'reserved' OR reserved_at IS NOT NULL`,
    ),
    check(
      'migration_lineage_committed_requires_afenda_id',
      sql`state <> 'committed' OR afenda_id IS NOT NULL`,
    ),
    check('migration_lineage_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type MigrationLineageRow = typeof migrationLineage.$inferSelect;
export type NewMigrationLineageRow = typeof migrationLineage.$inferInsert;
