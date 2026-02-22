/**
 * Bank Accounts Table
 *
 * Master data for company bank accounts and counterparty bank identities.
 * Maps operational bank identity (IBAN, SWIFT) to accounting identity (GL account).
 * Fixes orphan FK from bank_statements.bankAccountId and payment_runs.bankAccountId.
 */
import { sql } from 'drizzle-orm';
import { boolean, check, index, pgTable, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { currencyCodeStrict } from '../helpers/field-types';
import { erpIndexes } from '../helpers/standard-indexes';

export const bankAccounts = pgTable(
  'bank_accounts',
  {
    ...erpEntityColumns,

    /** Account number at the bank */
    accountNo: text('account_no').notNull(),
    /** Name of the bank institution */
    bankName: text('bank_name').notNull(),
    /** SWIFT / BIC code */
    bankCode: text('bank_code'),
    /** International Bank Account Number */
    iban: text('iban'),
    /** ISO 4217 currency — no default, must be explicit */
    currencyCode: currencyCodeStrict('currency_code'),
    /** Link to Chart of Accounts cash/bank GL account */
    glAccountId: uuid('gl_account_id'),
    /** Account type at the bank */
    accountType: text('account_type').notNull(),
    /** True for company-owned accounts; false for counterparty bank details */
    isCompanyAccount: boolean('is_company_account').notNull().default(true),
    /** Soft active flag (separate from isDeleted) */
    isActive: boolean('is_active').notNull().default(true),
    /** Free-form notes */
    notes: text('notes'),
  },
  (t) => [
    ...erpIndexes('bank_accounts', t),

    uniqueIndex('uq__bank_accounts__org_company_account_no').on(t.orgId, t.companyId, t.accountNo),
    index('bank_accounts_org_company_type_idx').on(t.orgId, t.companyId, t.accountType),

    check(
      'bank_accounts_valid_account_type',
      sql`account_type IN ('current', 'savings', 'fixed-deposit', 'money-market', 'escrow')`,
    ),
  ],
);

export type BankAccount = typeof bankAccounts.$inferSelect;
export type NewBankAccount = typeof bankAccounts.$inferInsert;
