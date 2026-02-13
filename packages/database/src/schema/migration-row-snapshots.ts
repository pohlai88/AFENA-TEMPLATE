import { sql } from 'drizzle-orm';
import { check, index, jsonb, integer, pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core';

import { tenantPolicy } from '../helpers/tenant-policy';

import { migrationJobs } from './migration-jobs';

/**
 * Migration row snapshots — Fix 4: O(changed rows) rollback.
 *
 * Stores pre-migration write-shape (core + custom separated)
 * so rollback can reconstruct persistable data for mutate().
 */
export const migrationRowSnapshots = pgTable(
  'migration_row_snapshots',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    orgId: text('org_id').notNull(),
    migrationJobId: uuid('migration_job_id').notNull().references(() => migrationJobs.id),
    entityType: text('entity_type').notNull(),
    entityId: uuid('entity_id').notNull(),
    beforeWriteCore: jsonb('before_write_core').notNull(),
    beforeWriteCustom: jsonb('before_write_custom').notNull(),
    beforeVersion: integer('before_version'),
    capturedAt: timestamp('captured_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('migration_row_snapshots_job_idx').on(table.migrationJobId, table.entityType),
    unique('migration_row_snapshots_job_entity_uniq').on(
      table.migrationJobId, table.entityType, table.entityId
    ),
    check('migration_row_snapshots_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ]
);

export type MigrationRowSnapshotRow = typeof migrationRowSnapshots.$inferSelect;
export type NewMigrationRowSnapshotRow = typeof migrationRowSnapshots.$inferInsert;
