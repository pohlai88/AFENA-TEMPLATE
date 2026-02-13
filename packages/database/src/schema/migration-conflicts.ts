import { sql } from 'drizzle-orm';
import { check, index, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { tenantPolicy } from '../helpers/tenant-policy';

import { migrationJobs } from './migration-jobs';

/**
 * Migration conflicts — detected duplicates during migration.
 * Stores legacy record + candidate matches with confidence scores.
 */
export const migrationConflicts = pgTable(
  'migration_conflicts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    orgId: text('org_id').notNull(),
    migrationJobId: uuid('migration_job_id').notNull().references(() => migrationJobs.id),
    entityType: text('entity_type').notNull(),
    legacyRecord: jsonb('legacy_record').notNull(),
    candidateMatches: jsonb('candidate_matches').notNull(),
    confidence: text('confidence').notNull(),
    resolution: text('resolution').notNull().default('pending'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('migration_conflicts_job_idx').on(table.migrationJobId),
    index('migration_conflicts_resolution_idx').on(table.orgId, table.resolution),
    check('migration_conflicts_confidence_chk', sql`confidence IN ('high', 'medium', 'low')`),
    check('migration_conflicts_resolution_chk', sql`resolution IN ('pending', 'merged', 'created_new', 'skipped', 'manual_review')`),
    check('migration_conflicts_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ]
);

export type MigrationConflictRow = typeof migrationConflicts.$inferSelect;
export type NewMigrationConflictRow = typeof migrationConflicts.$inferInsert;
