/**
 * WHT Rates Table
 *
 * Withholding tax rate schedules with effective dating.
 * Supports treaty rates (reduced rates under double-tax agreements)
 * and domestic rates.
 * Withholding Tax spine table — Phase 3, step 15.
 */
import { sql } from 'drizzle-orm';
import { check, date, index, numeric, pgTable, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const whtRates = pgTable(
  'wht_rates',
  {
    ...erpEntityColumns,

    /** FK to wht_codes */
    whtCodeId: uuid('wht_code_id').notNull(),
    /** Rate type: 'domestic', 'treaty', 'exempt' */
    rateType: text('rate_type').notNull().default('domestic'),
    /** Treaty partner country (null for domestic rates) */
    treatyCountry: text('treaty_country'),
    /** WHT rate (0.00 to 1.00, e.g., 0.10 = 10%) */
    rate: numeric('rate', { precision: 8, scale: 6 }).notNull(),
    /** Date this rate is effective from */
    effectiveFrom: date('effective_from').notNull(),
    /** Date this rate expires (null = no expiry) */
    effectiveTo: date('effective_to'),
  },
  (table) => [
    tenantPk(table),
    index('wr_org_id_idx').on(table.orgId, table.id),
    index('wr_org_created_idx').on(table.orgId, table.createdAt),
    // Lookup by WHT code + effective date
    index('wr_code_date_idx').on(table.orgId, table.whtCodeId, table.effectiveFrom),
    // Lookup by treaty country
    index('wr_treaty_idx').on(table.orgId, table.treatyCountry, table.effectiveFrom),
    // Unique rate per code + type + country + effective date
    uniqueIndex('wr_unique_rate_idx').on(
      table.orgId,
      table.whtCodeId,
      table.rateType,
      table.treatyCountry,
      table.effectiveFrom,
    ),
    check('wr_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    check('wr_valid_rate_type', sql`rate_type IN ('domestic', 'treaty', 'exempt')`),
    check('wr_rate_range', sql`rate >= 0 AND rate <= 1`),

    tenantPolicy(table),
  ],
);

export type WhtRate = typeof whtRates.$inferSelect;
export type NewWhtRate = typeof whtRates.$inferInsert;
