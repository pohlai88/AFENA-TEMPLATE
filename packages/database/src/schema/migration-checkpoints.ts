import { index, integer, jsonb, pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core';

import { tenantPolicy } from '../helpers/tenant-policy';

import { migrationJobs } from './migration-jobs';
import { tenantPk, tenantFk, tenantFkIndex} from '../helpers/base-entity';

/**
 * Migration checkpoints — step-level resume store.
 * OPS-02: Exactly one checkpoint row per (job, entity_type) — always overwritten via upsert.
 */
export const migrationCheckpoints = pgTable(
  'migration_checkpoints',
  {
    id: uuid('id').defaultRandom().notNull(),
    orgId: uuid('org_id').notNull(),
    migrationJobId: uuid('migration_job_id').notNull(),

    entityType: text('entity_type').notNull(),

    cursorJson: jsonb('cursor_json').notNull(),
    batchIndex: integer('batch_index').notNull(),
    loadedUpTo: integer('loaded_up_to').notNull(),
    transformVersion: text('transform_version').notNull(),

    planFingerprint: text('plan_fingerprint'),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    tenantPk(table),
    tenantFk(table, 'migration_job', table.migrationJobId, migrationJobs),
    tenantFkIndex(table, 'migration_job', table.migrationJobId),
    unique('migration_checkpoints_job_entity_uniq').on(table.migrationJobId, table.entityType),
    index('migration_checkpoints_job_idx').on(table.migrationJobId),
    tenantPolicy(table),
  ]
);

export type MigrationCheckpointRow = typeof migrationCheckpoints.$inferSelect;
export type NewMigrationCheckpointRow = typeof migrationCheckpoints.$inferInsert;
