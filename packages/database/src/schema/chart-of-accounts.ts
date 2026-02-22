/**
 * Chart of Accounts Table
 *
 * Defines the account structure for each company within a tenant.
 * Each company has its own COA (different subsidiaries may have different account structures).
 * Used by journal entry posting, trial balance, and financial reporting.
 */
import { sql } from 'drizzle-orm';
import { boolean, check, index, pgTable, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const chartOfAccounts = pgTable(
  'chart_of_accounts',
  {
    ...erpEntityColumns,

    /** Account code (e.g., '1000', '2100', '4000') */
    accountCode: text('account_code').notNull(),
    /** Human-readable account name */
    accountName: text('account_name').notNull(),
    /** Account type: asset, liability, equity, revenue, expense */
    accountType: text('account_type').notNull(),
    /** Parent account ID for hierarchical COA (null = top-level) */
    parentAccountId: uuid('parent_account_id'),
    /** Whether this account can receive postings (false = summary/header account) */
    isPostable: boolean('is_postable').notNull().default(true),
    /** Normal balance side: 'debit' or 'credit' */
    normalBalance: text('normal_balance').notNull().default('debit'),
    /** Currency for this account (null = company base currency) */
    currency: text('currency'),
    /** Whether this account is active */
    isActive: boolean('is_active').notNull().default(true),
    /** Optional description */
    description: text('description'),
  },
  (table) => [
    tenantPk(table),
    index('coa_org_id_idx').on(table.orgId, table.id),
    index('coa_org_created_idx').on(table.orgId, table.createdAt),
    // Lookup by company + account code
    index('coa_company_code_idx').on(table.orgId, table.companyId, table.accountCode),
    // Lookup by account type
    index('coa_type_idx').on(table.orgId, table.companyId, table.accountType),
    // Unique constraint: one account code per company
    uniqueIndex('coa_unique_code_idx').on(table.orgId, table.companyId, table.accountCode),
    check('coa_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    check('coa_valid_account_type', sql`account_type IN ('asset', 'liability', 'equity', 'revenue', 'expense')`),
    check('coa_valid_normal_balance', sql`normal_balance IN ('debit', 'credit')`),

    tenantPolicy(table),
  ],
);

export type ChartOfAccount = typeof chartOfAccounts.$inferSelect;
export type NewChartOfAccount = typeof chartOfAccounts.$inferInsert;
