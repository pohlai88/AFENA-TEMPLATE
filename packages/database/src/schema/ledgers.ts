/**
 * Ledgers Table
 *
 * Ledger master supporting multi-ledger accounting (IFRS, statutory, tax, management).
 * Each legal entity may have multiple ledgers with different reporting bases.
 * GL Platform spine table — Phase 3, step 11.
 */
import { sql } from 'drizzle-orm';
import { boolean, check, index, pgTable, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const ledgers = pgTable(
  'ledgers',
  {
    ...erpEntityColumns,

    /** Short code for the ledger (e.g., 'IFRS', 'STAT', 'TAX', 'MGMT') */
    ledgerCode: text('ledger_code').notNull(),
    /** Human-readable ledger name */
    name: text('name').notNull(),
    /** Ledger type: 'primary' (IFRS/GAAP), 'statutory', 'tax', 'management' */
    ledgerType: text('ledger_type').notNull().default('primary'),
    /** Chart of accounts ID linked to this ledger */
    chartOfAccountsId: uuid('chart_of_accounts_id'),
    /** Reporting currency for this ledger (ISO 4217) */
    currencyCode: text('currency_code').notNull().default('MYR'),
    /** Calendar type: 'calendar', '4-4-5', '4-5-4', '5-4-4', 'custom' */
    calendarType: text('calendar_type').notNull().default('calendar'),
    /** Fiscal year start month (1-12) */
    fiscalYearStartMonth: text('fiscal_year_start_month').notNull().default('1'),
    /** Whether this is the primary/default ledger for the company */
    isPrimary: boolean('is_primary').notNull().default(false),
    /** Whether this ledger is active */
    isActive: boolean('is_active').notNull().default(true),
    /** Description / notes */
    description: text('description'),
  },
  (table) => [
    tenantPk(table),
    index('ledgers_org_id_idx').on(table.orgId, table.id),
    index('ledgers_org_created_idx').on(table.orgId, table.createdAt),
    // Lookup by company + ledger code
    index('ledgers_company_idx').on(table.orgId, table.companyId, table.ledgerCode),
    // Unique ledger code per company
    uniqueIndex('ledgers_unique_code_idx').on(table.orgId, table.companyId, table.ledgerCode),
    check('ledgers_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    check('ledgers_valid_type', sql`ledger_type IN ('primary', 'statutory', 'tax', 'management')`),
    check(
      'ledgers_valid_calendar',
      sql`calendar_type IN ('calendar', '4-4-5', '4-5-4', '5-4-4', 'custom')`,
    ),

    tenantPolicy(table),
  ],
);

export type Ledger = typeof ledgers.$inferSelect;
export type NewLedger = typeof ledgers.$inferInsert;
