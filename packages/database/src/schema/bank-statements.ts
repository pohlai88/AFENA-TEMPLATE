/**
 * Bank Statements Table
 *
 * Imported bank statement headers for reconciliation.
 * Each statement covers a date range for a specific bank account.
 * Missing sub-ledger table — Phase 3, step 17.
 */
import { sql } from 'drizzle-orm';
import {
  bigint,
  check,
  date,
  index,
  integer,
  pgTable,
  text,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { docEntityColumns } from '../helpers/doc-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const bankStatements = pgTable(
  'bank_statements',
  {
    ...docEntityColumns,

    /** Statement reference / number */
    statementNo: text('statement_no'),
    /** FK to bank accounts */
    bankAccountId: uuid('bank_account_id').notNull(),
    /** Statement start date */
    startDate: date('start_date').notNull(),
    /** Statement end date */
    endDate: date('end_date').notNull(),
    /** Opening balance in minor units */
    openingBalanceMinor: bigint('opening_balance_minor', { mode: 'number' }).notNull(),
    /** Closing balance in minor units */
    closingBalanceMinor: bigint('closing_balance_minor', { mode: 'number' }).notNull(),
    /** Total debits in minor units */
    totalDebitsMinor: bigint('total_debits_minor', { mode: 'number' }).notNull().default(0),
    /** Total credits in minor units */
    totalCreditsMinor: bigint('total_credits_minor', { mode: 'number' }).notNull().default(0),
    /** Number of transactions */
    transactionCount: integer('transaction_count').notNull().default(0),
    /** Currency code */
    currencyCode: text('currency_code').notNull().default('MYR'),
    /** Import source: 'manual', 'mt940', 'camt053', 'csv', 'ofx' */
    importSource: text('import_source').notNull().default('manual'),
    /** Reconciliation status: 'unreconciled', 'partial', 'reconciled' */
    reconciliationStatus: text('reconciliation_status').notNull().default('unreconciled'),
  },
  (table) => [
    tenantPk(table),
    index('bs_org_id_idx').on(table.orgId, table.id),
    index('bs_org_created_idx').on(table.orgId, table.createdAt),
    // Lookup by bank account + date range
    index('bs_bank_date_idx').on(table.orgId, table.bankAccountId, table.startDate),
    // Lookup by reconciliation status
    index('bs_recon_status_idx').on(table.orgId, table.reconciliationStatus),
    // Unique statement per bank account + period
    uniqueIndex('bs_unique_period_idx').on(
      table.orgId,
      table.bankAccountId,
      table.startDate,
      table.endDate,
    ),
    check('bs_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    check('bs_valid_source', sql`import_source IN ('manual', 'mt940', 'camt053', 'csv', 'ofx')`),
    check(
      'bs_valid_recon_status',
      sql`reconciliation_status IN ('unreconciled', 'partial', 'reconciled')`,
    ),
    check('bs_valid_dates', sql`end_date >= start_date`),

    tenantPolicy(table),
  ],
);

export type BankStatement = typeof bankStatements.$inferSelect;
export type NewBankStatement = typeof bankStatements.$inferInsert;
