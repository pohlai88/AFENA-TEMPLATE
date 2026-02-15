import { sql } from 'drizzle-orm';
import { check, index, jsonb, pgTable, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { tenantPolicy } from '../helpers/tenant-policy';

import { metaAssets } from './meta-assets';

/**
 * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.
 */
export const metaQualityChecks = pgTable(
  'meta_quality_checks',
  {
    id: uuid('id').defaultRandom().notNull(),
    orgId: text('org_id')
      .notNull()
      .default(sql`(auth.require_org_id())`),
    targetAssetId: uuid('target_asset_id')
      .notNull()
      .references(() => metaAssets.id, { onDelete: 'cascade' }),
    ruleType: text('rule_type').notNull(),
    config: jsonb('config')
      .notNull()
      .default(sql`'{}'::jsonb`),
    lastRunAt: timestamp('last_run_at', { withTimezone: true }),
    lastRunStatus: text('last_run_status'),
    lastRunDetail: jsonb('last_run_detail'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    index('meta_quality_checks_org_id_idx').on(table.orgId, table.id),
    check('meta_quality_checks_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type MetaQualityCheck = typeof metaQualityChecks.$inferSelect;
export type NewMetaQualityCheck = typeof metaQualityChecks.$inferInsert;
