import { sql } from 'drizzle-orm';
import { check, index, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { tenantPolicy } from '../helpers/tenant-policy';

import { migrationConflicts } from './migration-conflicts';
import { migrationJobs } from './migration-jobs';
import { tenantPk, tenantFk, tenantFkIndex} from '../helpers/base-entity';

/**
 * Migration conflict resolutions — how conflicts were resolved.
 * Nit B: migration_job_id denormalized for job-scoped evidence queries.
 */
export const migrationConflictResolutions = pgTable(
  'migration_conflict_resolutions',
  {
    id: uuid('id').defaultRandom().notNull(),
    orgId: uuid('org_id').notNull(),
    conflictId: uuid('conflict_id').notNull(),
    migrationJobId: uuid('migration_job_id'),
    decision: text('decision').notNull(),
    chosenCandidateId: uuid('chosen_candidate_id'),
    fieldDecisions: jsonb('field_decisions'),
    resolver: text('resolver').notNull(),
    resolvedAt: timestamp('resolved_at', { withTimezone: true }).defaultNow().notNull(),
    resolvedBy: text('resolved_by').notNull().default(sql`auth.user_id()`),
  },
  (table) => [
    tenantPk(table),
    tenantFk(table, 'migration_job', table.migrationJobId, migrationJobs),
    tenantFkIndex(table, 'migration_job', table.migrationJobId),
    tenantFk(table, 'conflict', table.conflictId, migrationConflicts),
    tenantFkIndex(table, 'conflict', table.conflictId),
    index('migration_conflict_resolutions_conflict_idx').on(table.conflictId),
    index('migration_conflict_resolutions_job_idx').on(table.migrationJobId, table.decision),
    check('migration_conflict_resolutions_decision_chk', sql`decision IN ('merged', 'created_new', 'skipped')`),
    check('migration_conflict_resolutions_resolver_chk', sql`resolver IN ('auto', 'manual')`),
    check('migration_conflict_resolutions_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    tenantPolicy(table),
  ]
);

export type MigrationConflictResolutionRow = typeof migrationConflictResolutions.$inferSelect;
export type NewMigrationConflictResolutionRow = typeof migrationConflictResolutions.$inferInsert;
