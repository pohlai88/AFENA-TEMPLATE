import { sql } from 'drizzle-orm';
import { check, index, integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Migration jobs — top-level job registry.
 * Each job migrates one entity type from one source system.
 */
export const migrationJobs = pgTable(
  'migration_jobs',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    orgId: text('org_id').notNull(),
    entityType: text('entity_type').notNull(),
    sourceConfig: jsonb('source_config').notNull(),
    fieldMappings: jsonb('field_mappings').notNull(),
    mergePolicies: jsonb('merge_policies').notNull(),
    conflictStrategy: text('conflict_strategy').notNull(),
    status: text('status').notNull(),
    checkpointCursor: jsonb('checkpoint_cursor'),
    recordsSuccess: integer('records_success').notNull().default(0),
    recordsFailed: integer('records_failed').notNull().default(0),
    maxRuntimeMs: integer('max_runtime_ms'),
    rateLimit: integer('rate_limit'),
    preflightChecks: jsonb('preflight_checks'),
    postflightChecks: jsonb('postflight_checks'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    startedAt: timestamp('started_at', { withTimezone: true }),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    createdBy: text('created_by').notNull().default(sql`auth.user_id()`),
  },
  (table) => [
    index('migration_jobs_org_status_idx').on(table.orgId, table.status),
    index('migration_jobs_entity_type_idx').on(table.entityType),
    check('migration_jobs_status_chk', sql`status IN ('pending', 'preflight', 'ready', 'blocked', 'running', 'paused', 'cancelling', 'cancelled', 'completed', 'failed', 'rolled_back')`),
    check('migration_jobs_conflict_strategy_chk', sql`conflict_strategy IN ('skip', 'overwrite', 'merge', 'manual')`),
    check('migration_jobs_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ]
);

export type MigrationJobRow = typeof migrationJobs.$inferSelect;
export type NewMigrationJobRow = typeof migrationJobs.$inferInsert;
