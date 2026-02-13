import { sql } from 'drizzle-orm';
import { check, index, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { tenantPolicy } from '../helpers/tenant-policy';

import { migrationConflicts } from './migration-conflicts';
import { migrationJobs } from './migration-jobs';

/**
 * Migration conflict resolutions — how conflicts were resolved.
 * Nit B: migration_job_id denormalized for job-scoped evidence queries.
 */
export const migrationConflictResolutions = pgTable(
  'migration_conflict_resolutions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    orgId: text('org_id').notNull(),
    conflictId: uuid('conflict_id').notNull().references(() => migrationConflicts.id),
    migrationJobId: uuid('migration_job_id').references(() => migrationJobs.id),
    decision: text('decision').notNull(),
    chosenCandidateId: uuid('chosen_candidate_id'),
    fieldDecisions: jsonb('field_decisions'),
    resolver: text('resolver').notNull(),
    resolvedAt: timestamp('resolved_at', { withTimezone: true }).defaultNow().notNull(),
    resolvedBy: text('resolved_by').notNull().default(sql`auth.user_id()`),
  },
  (table) => [
    index('migration_conflict_resolutions_conflict_idx').on(table.conflictId),
    index('migration_conflict_resolutions_job_idx').on(table.migrationJobId, table.decision),
    check('migration_conflict_resolutions_decision_chk', sql`decision IN ('merged', 'created_new', 'skipped')`),
    check('migration_conflict_resolutions_resolver_chk', sql`resolver IN ('auto', 'manual')`),
    check('migration_conflict_resolutions_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ]
);

export type MigrationConflictResolutionRow = typeof migrationConflictResolutions.$inferSelect;
export type NewMigrationConflictResolutionRow = typeof migrationConflictResolutions.$inferInsert;
