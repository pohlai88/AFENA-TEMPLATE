/**
 * FX Rates Table
 *
 * Stores foreign exchange rates for currency conversions.
 * PRD Phase A #5 — FX Rates lookup by currency pair and effective date.
 */
import { sql } from 'drizzle-orm';
import { check, date, index, numeric, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const fxRates = pgTable(
  'fx_rates',
  {
    ...erpEntityColumns,

    /** Source currency code (e.g., 'USD') */
    fromCurrency: text('from_currency').notNull(),
    /** Target currency code (e.g., 'MYR') */
    toCurrency: text('to_currency').notNull(),
    /** Exchange rate (target amount per 1 source unit) */
    rate: numeric('rate', { precision: 18, scale: 8 }).notNull(),
    /** Date this rate is effective from */
    effectiveDate: date('effective_date').notNull(),
    /** Source of the rate (e.g., 'central_bank', 'manual', 'api') */
    source: text('source').notNull().default('manual'),
  },
  (table) => [
    tenantPk(table),
    index('fx_rates_org_id_idx').on(table.orgId, table.id),
    index('fx_rates_org_created_idx').on(table.orgId, table.createdAt),
    // Lookup index: most recent rate for currency pair on/before date
    index('fx_rates_lookup_idx').on(table.orgId, table.fromCurrency, table.toCurrency, table.effectiveDate),
    // Unique constraint: one rate per org/pair/date/source
    uniqueIndex('fx_rates_unique_idx').on(table.orgId, table.fromCurrency, table.toCurrency, table.effectiveDate, table.source),
    check('fx_rates_org_not_empty', sql`org_id <> ''`),
    check('fx_rates_positive_rate', sql`rate > 0`),

    tenantPolicy(table),
  ],
);

export type FxRate = typeof fxRates.$inferSelect;
export type NewFxRate = typeof fxRates.$inferInsert;
