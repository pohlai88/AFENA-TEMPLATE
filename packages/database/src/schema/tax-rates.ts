/**
 * Tax Rates Table
 *
 * Stores tax rate configurations for different tax codes and jurisdictions.
 * Used by tax calculation services for invoicing and compliance.
 */
import { sql } from 'drizzle-orm';
import { check, date, index, numeric, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const taxRates = pgTable(
  'tax_rates',
  {
    ...erpEntityColumns,

    /** Tax code identifier (e.g., 'VAT_STD', 'GST', 'SST_6') */
    taxCode: text('tax_code').notNull(),
    /** Human-readable name */
    name: text('name').notNull(),
    /** Tax rate as decimal (e.g., 0.06 for 6%) */
    rate: numeric('rate', { precision: 8, scale: 6 }).notNull(),
    /** Date this rate is effective from */
    effectiveFrom: date('effective_from').notNull(),
    /** Date this rate is effective until (null = current) */
    effectiveTo: date('effective_to'),
    /** Tax jurisdiction (e.g., 'MY', 'US-CA', 'EU-DE') */
    jurisdiction: text('jurisdiction'),
    /** Tax type: 'sales', 'purchase', 'withholding', 'excise' */
    taxType: text('tax_type').notNull().default('sales'),
    /** Whether this rate is currently active */
    status: text('status').notNull().default('active'),
  },
  (table) => [
    tenantPk(table),
    index('tax_rates_org_id_idx').on(table.orgId, table.id),
    index('tax_rates_org_created_idx').on(table.orgId, table.createdAt),
    // Lookup by tax code and effective date
    index('tax_rates_code_date_idx').on(table.orgId, table.taxCode, table.effectiveFrom),
    // Lookup by jurisdiction
    index('tax_rates_jurisdiction_idx').on(table.orgId, table.jurisdiction, table.taxCode),
    // Unique constraint: one rate per code/effective_from
    uniqueIndex('tax_rates_unique_idx').on(table.orgId, table.taxCode, table.effectiveFrom),
    check('tax_rates_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    check('tax_rates_valid_rate', sql`rate >= 0 AND rate <= 1`),

    tenantPolicy(table),
  ],
);

export type TaxRate = typeof taxRates.$inferSelect;
export type NewTaxRate = typeof taxRates.$inferInsert;
