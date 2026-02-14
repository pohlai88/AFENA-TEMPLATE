import { sql } from 'drizzle-orm';
import { bigint, check, date, index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { baseEntityColumns } from '../helpers/base-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Bank reconciliation sessions — tracks reconciliation runs.
 *
 * Audit P1-7:
 * - Groups matched bank_statement_lines into a session
 * - Tracks reconciliation status (in_progress, completed, approved)
 * - Records preparer and approver for audit trail
 * - Statement date range for the reconciliation window
 * - Closing balance for period-end verification
 */
export const bankReconciliationSessions = pgTable(
  'bank_reconciliation_sessions',
  {
    ...baseEntityColumns,
    companyId: uuid('company_id').notNull(),
    bankAccountId: uuid('bank_account_id').notNull(),
    statementDateFrom: date('statement_date_from').notNull(),
    statementDateTo: date('statement_date_to').notNull(),
    closingBalanceMinor: bigint('closing_balance_minor', { mode: 'number' }),
    reconciledBalanceMinor: bigint('reconciled_balance_minor', { mode: 'number' }),
    differenceMinor: bigint('difference_minor', { mode: 'number' }),
    currencyCode: text('currency_code').notNull().default('MYR'),
    status: text('status').notNull().default('in_progress'),
    preparedBy: text('prepared_by')
      .notNull()
      .default(sql`(auth.user_id())`),
    approvedBy: text('approved_by'),
    approvedAt: timestamp('approved_at', { withTimezone: true }),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    memo: text('memo'),
  },
  (table) => [
    index('bank_recon_org_id_idx').on(table.orgId, table.id),
    index('bank_recon_org_company_idx').on(table.orgId, table.companyId),
    index('bank_recon_org_bank_acct_idx').on(table.orgId, table.bankAccountId),
    index('bank_recon_status_idx').on(table.orgId, table.status),
    check('bank_recon_org_not_empty', sql`org_id <> ''`),
    check('bank_recon_status_valid', sql`status IN ('in_progress', 'completed', 'approved', 'cancelled')`),
    check('bank_recon_date_order', sql`statement_date_from <= statement_date_to`),
    tenantPolicy(table),
  ],
);

export type BankReconciliationSession = typeof bankReconciliationSessions.$inferSelect;
export type NewBankReconciliationSession = typeof bankReconciliationSessions.$inferInsert;
