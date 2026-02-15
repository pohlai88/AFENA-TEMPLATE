import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  date,
  index,
  integer,
  numeric,
  pgTable,
  primaryKey,
  text,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

import { baseEntityColumns } from '../helpers/base-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Tax rates / rules — versioned, time-bounded, never retroactively edited.
 *
 * PRD G0.7 + Phase B #9:
 * - Deterministic: same input → same tax forever
 * - Immutability: changes are new rows with new effective_from/effective_to
 * - rounding_method CHECK: 'half_up', 'half_down', 'ceil', 'floor', 'banker'
 * - rounding_precision: number of decimal places for rounding
 * - rate stored as NUMERIC(10,6) — e.g., 6.000000 for 6% GST
 * - UNIQUE(org_id, tax_code, effective_from) — one rate per code per effective date
 * 
 * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.
 */
export const taxRates = pgTable(
  'tax_rates',
  {
    ...baseEntityColumns,
    taxCode: text('tax_code').notNull(),
    name: text('name').notNull(),
    rate: numeric('rate', { precision: 10, scale: 6 }).notNull(),
    jurisdiction: text('jurisdiction'),
    taxType: text('tax_type').notNull().default('gst'),
    roundingMethod: text('rounding_method').notNull().default('half_up'),
    roundingPrecision: integer('rounding_precision').notNull().default(2),
    effectiveFrom: date('effective_from').notNull(),
    effectiveTo: date('effective_to'),
    isCompound: boolean('is_compound').notNull().default(false),
    description: text('description'),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    index('tax_rates_org_id_idx').on(table.orgId, table.id),
    index('tax_rates_org_code_idx').on(table.orgId, table.taxCode),
    index('tax_rates_effective_idx').on(table.orgId, table.taxCode, table.effectiveFrom),
    uniqueIndex('tax_rates_org_code_effective_uniq').on(
      table.orgId,
      table.taxCode,
      table.effectiveFrom,
    ),
    check('tax_rates_org_not_empty', sql`org_id <> ''`),
    check('tax_rates_rate_non_negative', sql`rate >= 0`),
    check('tax_rates_tax_type_valid', sql`tax_type IN ('gst', 'vat', 'sales_tax', 'service_tax', 'withholding', 'exempt', 'zero_rated')`),
    check('tax_rates_rounding_valid', sql`rounding_method IN ('half_up', 'half_down', 'ceil', 'floor', 'banker')`),
    check('tax_rates_date_order', sql`effective_to IS NULL OR effective_from <= effective_to`),
    tenantPolicy(table),
  ],
);

export type TaxRate = typeof taxRates.$inferSelect;
export type NewTaxRate = typeof taxRates.$inferInsert;
