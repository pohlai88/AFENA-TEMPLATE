import { sql } from 'drizzle-orm';
import { check, index, integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { tenantPolicy } from '../helpers/tenant-policy';

import { migrationJobs } from './migration-jobs';

/**
 * Migration merge explanations — queryable "why" for conflict decisions.
 * ACC-05: The "why" behind every merge must be queryable.
 */
export const migrationMergeExplanations = pgTable(
  'migration_merge_explanations',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    orgId: text('org_id').notNull(),
    migrationJobId: uuid('migration_job_id').notNull().references(() => migrationJobs.id),

    entityType: text('entity_type').notNull(),
    legacyId: text('legacy_id').notNull(),
    targetId: text('target_id').notNull(),
    decision: text('decision').notNull(),

    scoreTotal: integer('score_total').notNull(),
    reasons: jsonb('reasons').notNull(),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('migration_merge_explanations_job_idx').on(table.migrationJobId),
    index('migration_merge_explanations_decision_idx').on(table.migrationJobId, table.decision),
    check('migration_merge_explanations_decision_chk', sql`decision IN ('merged', 'manual_review', 'created_new')`),
    tenantPolicy(table),
  ]
);

export type MigrationMergeExplanationRow = typeof migrationMergeExplanations.$inferSelect;
export type NewMigrationMergeExplanationRow = typeof migrationMergeExplanations.$inferInsert;
