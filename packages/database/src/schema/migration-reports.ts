import { sql } from 'drizzle-orm';
import { authenticatedRole, crudPolicy } from 'drizzle-orm/neon';
import { index, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

/**
 * Migration reports — signed, canonical JSON with SHA-256 hash.
 * RLS via join to migration_jobs (reports don't have org_id directly).
 */
export const migrationReports = pgTable(
  'migration_reports',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    jobId: uuid('job_id').notNull(),
    reportData: jsonb('report_data').notNull(),
    reportHash: text('report_hash').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('migration_reports_job_idx').on(table.jobId),
    index('migration_reports_hash_idx').on(table.reportHash),
    crudPolicy({
      role: authenticatedRole,
      read: sql`(select EXISTS (SELECT 1 FROM migration_jobs WHERE migration_jobs.id = ${table.jobId} AND migration_jobs.org_id = auth.org_id()::uuid))`,
      modify: sql`(select EXISTS (SELECT 1 FROM migration_jobs WHERE migration_jobs.id = ${table.jobId} AND migration_jobs.org_id = auth.org_id()::uuid))`,
    }),
  ]
);

export type MigrationReportRow = typeof migrationReports.$inferSelect;
export type NewMigrationReportRow = typeof migrationReports.$inferInsert;
