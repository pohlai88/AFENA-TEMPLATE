import { sql } from 'drizzle-orm';
import { bigint, boolean, check, foreignKey, index, pgTable, primaryKey, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { baseEntityColumns } from '../helpers/base-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

import { companies } from './companies';

/**
 * Bank accounts — company bank account master data.
 *
 * RULE C-01: Bank accounts are LEGAL-scoped (company owns bank accounts).
 * Audit P0-3:
 * - Referenced by payments.bank_account_id and bank_statement_lines.bank_account_id
 * - Scoped to company for legal entity isolation
 * - Supports multi-currency accounts
 * - GL account link for automatic journalization
 * - UNIQUE(org_id, company_id, account_number) prevents duplicates
 * 
 * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.
 */
export const bankAccounts = pgTable(
  'bank_accounts',
  {
    ...baseEntityColumns,
    companyId: uuid('company_id').notNull(),
    bankName: text('bank_name').notNull(),
    accountName: text('account_name').notNull(),
    accountNumber: text('account_number').notNull(),
    accountType: text('account_type').notNull().default('current'),
    currencyCode: text('currency_code').notNull().default('MYR'),
    swiftCode: text('swift_code'),
    iban: text('iban'),
    branchCode: text('branch_code'),
    branchName: text('branch_name'),
    glAccountId: uuid('gl_account_id'),
    openingBalanceMinor: bigint('opening_balance_minor', { mode: 'number' }).notNull().default(0),
    currentBalanceMinor: bigint('current_balance_minor', { mode: 'number' }).notNull().default(0),
    isDefault: boolean('is_default').notNull().default(false),
    isActive: boolean('is_active').notNull().default(true),
    description: text('description'),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    foreignKey({
      columns: [table.orgId, table.companyId],
      foreignColumns: [companies.orgId, companies.id],
      name: 'bank_accounts_company_fk',
    }),
    index('bank_accounts_org_id_idx').on(table.orgId, table.id),
    index('bank_acct_org_company_idx').on(table.orgId, table.companyId),
    uniqueIndex('bank_acct_org_company_number_uniq').on(
      table.orgId,
      table.companyId,
      table.accountNumber,
    ),
    check('bank_acct_org_not_empty', sql`org_id <> ''`),
    check('bank_acct_type_valid', sql`account_type IN ('current', 'savings', 'fixed_deposit', 'overdraft', 'credit_line', 'petty_cash')`),
    tenantPolicy(table),
  ],
);

export type BankAccount = typeof bankAccounts.$inferSelect;
export type NewBankAccount = typeof bankAccounts.$inferInsert;
