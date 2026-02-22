import { sql } from 'drizzle-orm';
import { boolean, check, date, index, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { currencyCodeStrict, moneyMinor } from '../helpers/field-types';
import { erpIndexes } from '../helpers/standard-indexes';

export const treasuryAccounts = pgTable(
  'treasury_accounts',
  {
    ...erpEntityColumns,
    accountNo: text('account_no').notNull(),
    bankName: text('bank_name').notNull(),
    accountType: text('account_type').notNull(),
    currencyCode: currencyCodeStrict('currency_code'),
    bookBalanceMinor: moneyMinor('book_balance_minor'),
    asOfDate: date('as_of_date').notNull(),
    isActive: boolean('is_active').notNull().default(true),
    notes: text('notes'),
  },
  (t) => [
    ...erpIndexes('treasury_accounts', t),
    uniqueIndex('uq__treasury_accounts__org_company_account_no').on(
      t.orgId,
      t.companyId,
      t.accountNo,
    ),
    index('treasury_accounts_org_company_type_idx').on(t.orgId, t.companyId, t.accountType),
    check(
      'treasury_accounts_valid_account_type',
      sql`account_type IN ('current', 'savings', 'fixed-deposit', 'money-market', 'escrow')`,
    ),
  ],
);

export type TreasuryAccountRow = typeof treasuryAccounts.$inferSelect;
export type NewTreasuryAccountRow = typeof treasuryAccounts.$inferInsert;
