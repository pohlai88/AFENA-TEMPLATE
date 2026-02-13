import { sql } from 'drizzle-orm';
import { check, index, integer, jsonb, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { tenantPolicy } from '../helpers/tenant-policy';

import { migrationJobs } from './migration-jobs';

/**
 * Migration quarantine — per-record retry + error isolation.
 * OPS-01: One bad row must never poison a batch.
 */
export const migrationQuarantine = pgTable(
  'migration_quarantine',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    attemptId: uuid('attempt_id').defaultRandom().notNull(),

    orgId: text('org_id').notNull(),
    migrationJobId: uuid('migration_job_id').notNull().references(() => migrationJobs.id),

    entityType: text('entity_type').notNull(),
    legacyId: text('legacy_id').notNull(),
    legacySystem: text('legacy_system').notNull(),

    recordData: jsonb('record_data').notNull(),
    transformVersion: text('transform_version').notNull(),
    failureStage: text('failure_stage').notNull(),

    errorClass: text('error_class').notNull(),
    errorCode: text('error_code').notNull(),
    errorMessage: text('error_message'),
    lastErrorHash: text('last_error_hash'),

    retryCount: integer('retry_count').notNull().default(0),
    replayAfter: timestamp('replay_after', { withTimezone: true }),

    status: text('status').notNull().default('quarantined'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    resolvedAt: timestamp('resolved_at', { withTimezone: true }),
  },
  (table) => [
    index('migration_quarantine_job_idx').on(table.migrationJobId),
    index('migration_quarantine_status_idx').on(table.migrationJobId, table.status),
    check('migration_quarantine_status_chk', sql`status IN ('quarantined', 'retrying', 'resolved', 'abandoned')`),
    check('migration_quarantine_stage_chk', sql`failure_stage IN ('extract', 'transform', 'detect', 'reserve', 'load', 'snapshot')`),
    check('migration_quarantine_class_chk', sql`error_class IN ('transient', 'permanent')`),
    uniqueIndex('migration_quarantine_dedupe')
      .on(table.migrationJobId, table.entityType, table.legacyId, table.lastErrorHash)
      .where(sql`status IN ('quarantined', 'retrying')`),
    tenantPolicy(table),
  ]
);

export type MigrationQuarantineRow = typeof migrationQuarantine.$inferSelect;
export type NewMigrationQuarantineRow = typeof migrationQuarantine.$inferInsert;
