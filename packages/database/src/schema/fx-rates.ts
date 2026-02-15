import { sql } from 'drizzle-orm';
import { check, date, index, numeric, pgTable, primaryKey, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * FX rates — historical exchange rates per currency pair per day.
 *
 * PRD Phase A #5:
 * - effective_date is DATE (not timestamptz) — interpreted in company timezone for cutoff
 * - source CHECK: 'manual', 'api', 'import'
 * - UNIQUE(org_id, from_code, to_code, effective_date, source)
 * - Rate lookup: latest rate ≤ document date for the currency pair
 * - captured_at: optional timestamptz for API-provided timestamps
 * 
 * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.
 */
export const fxRates = pgTable(
  'fx_rates',
  {
    id: uuid('id').defaultRandom().notNull(),
    orgId: text('org_id')
      .notNull()
      .default(sql`(auth.require_org_id())`),
    fromCode: text('from_code').notNull(),
    toCode: text('to_code').notNull(),
    effectiveDate: date('effective_date').notNull(),
    rate: numeric('rate', { precision: 20, scale: 10 }).notNull(),
    source: text('source').notNull().default('manual'),
    capturedAt: timestamp('captured_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    createdBy: text('created_by')
      .notNull()
      .default(sql`(auth.user_id())`),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    index('fx_rates_org_id_idx').on(table.orgId, table.id),
    index('fx_rates_lookup_idx').on(table.orgId, table.fromCode, table.toCode, table.effectiveDate),
    uniqueIndex('fx_rates_org_pair_date_source_uniq').on(
      table.orgId,
      table.fromCode,
      table.toCode,
      table.effectiveDate,
      table.source,
    ),
    check('fx_rates_org_not_empty', sql`org_id <> ''`),
    check('fx_rates_source_valid', sql`source IN ('manual', 'api', 'import')`),
    check('fx_rates_rate_positive', sql`rate > 0`),
    tenantPolicy(table),
  ],
);

export type FxRate = typeof fxRates.$inferSelect;
export type NewFxRate = typeof fxRates.$inferInsert;
