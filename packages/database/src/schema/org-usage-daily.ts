import { sql } from 'drizzle-orm';
import { bigint, check, date, integer, pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';

import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Org usage metering — daily counters per tenant.
 * Updated via cheap upserts. Bill later.
 * PK is (org_id, day) — one row per org per day.
 */
export const orgUsageDaily = pgTable(
  'org_usage_daily',
  {
    orgId: uuid('org_id')
      .notNull()
      .default(sql`(auth.org_id()::uuid)`),
    day: date('day').notNull(),
    apiRequests: integer('api_requests').notNull().default(0),
    jobRuns: integer('job_runs').notNull().default(0),
    jobMs: bigint('job_ms', { mode: 'number' }).notNull().default(0),
    dbTimeouts: integer('db_timeouts').notNull().default(0),
    storageBytes: bigint('storage_bytes', { mode: 'number' }).notNull().default(0),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.day] }),
    check('org_usage_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    tenantPolicy(table),
  ],
);

export type OrgUsageDaily = typeof orgUsageDaily.$inferSelect;
export type NewOrgUsageDaily = typeof orgUsageDaily.$inferInsert;
