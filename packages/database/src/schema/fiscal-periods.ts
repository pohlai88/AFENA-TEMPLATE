/**
 * Fiscal Periods Table
 *
 * Defines fiscal periods (months/quarters/years) for accounting purposes.
 * Used for period-based reporting, closing, and depreciation schedules.
 */
import { sql } from 'drizzle-orm';
import { boolean, check, date, index, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const fiscalPeriods = pgTable(
  'fiscal_periods',
  {
    ...erpEntityColumns,

    /** Period name (e.g., 'Jan 2024', 'Q1 2024', 'FY2024') */
    name: text('name').notNull(),
    /** Period type: 'month', 'quarter', 'year' */
    periodType: text('period_type').notNull(),
    /** Start date of the period */
    startDate: date('start_date').notNull(),
    /** End date of the period (inclusive) */
    endDate: date('end_date').notNull(),
    /** Whether the period is closed for posting */
    isClosed: boolean('is_closed').notNull().default(false),
    /** Fiscal year this period belongs to */
    fiscalYear: text('fiscal_year').notNull(),
    /** Period number within the fiscal year (1-12 for months, 1-4 for quarters) */
    periodNumber: text('period_number'),
  },
  (table) => [
    tenantPk(table),
    index('fiscal_periods_org_id_idx').on(table.orgId, table.id),
    index('fiscal_periods_org_created_idx').on(table.orgId, table.createdAt),
    // Lookup by date range
    index('fiscal_periods_date_idx').on(table.orgId, table.startDate, table.endDate),
    // Lookup by fiscal year
    index('fiscal_periods_year_idx').on(table.orgId, table.fiscalYear, table.periodNumber),
    // Ensure no overlapping periods of the same type
    uniqueIndex('fiscal_periods_unique_idx').on(table.orgId, table.periodType, table.startDate),
    check('fiscal_periods_org_not_empty', sql`org_id <> ''`),
    check('fiscal_periods_valid_dates', sql`end_date >= start_date`),

    tenantPolicy(table),
  ],
);

export type FiscalPeriod = typeof fiscalPeriods.$inferSelect;
export type NewFiscalPeriod = typeof fiscalPeriods.$inferInsert;
