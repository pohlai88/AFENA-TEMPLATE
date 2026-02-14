import { sql } from 'drizzle-orm';
import { bigint, boolean, check, date, index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { baseEntityColumns } from '../helpers/base-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Bank statement lines — append-only evidence for reconciliation.
 *
 * PRD G0.12 + Phase C #13.5:
 * - Statement lines are append-only evidence (REVOKE UPDATE/DELETE)
 * - Matching is auditable (who matched, when, how confident)
 * - Each line can be matched to a payment, journal entry, or left unmatched
 * - import_batch_id groups lines from a single statement import
 */
export const bankStatementLines = pgTable(
  'bank_statement_lines',
  {
    ...baseEntityColumns,
    companyId: uuid('company_id').notNull(),
    bankAccountId: uuid('bank_account_id').notNull(),
    statementDate: date('statement_date').notNull(),
    valueDate: date('value_date'),
    description: text('description').notNull(),
    reference: text('reference'),
    amountMinor: bigint('amount_minor', { mode: 'number' }).notNull(),
    currencyCode: text('currency_code').notNull().default('MYR'),
    balanceMinor: bigint('balance_minor', { mode: 'number' }),
    transactionType: text('transaction_type'),
    importBatchId: uuid('import_batch_id'),
    isReconciled: boolean('is_reconciled').notNull().default(false),
    matchedPaymentId: uuid('matched_payment_id'),
    matchedJournalEntryId: uuid('matched_journal_entry_id'),
    matchConfidence: text('match_confidence'),
    matchedBy: text('matched_by'),
    matchedAt: timestamp('matched_at', { withTimezone: true }),
    reconciliationSessionId: uuid('reconciliation_session_id'),
    memo: text('memo'),
  },
  (table) => [
    index('bsl_org_id_idx').on(table.orgId, table.id),
    index('bsl_company_idx').on(table.orgId, table.companyId),
    index('bsl_bank_account_idx').on(table.orgId, table.bankAccountId),
    index('bsl_statement_date_idx').on(table.orgId, table.bankAccountId, table.statementDate),
    index('bsl_import_batch_idx').on(table.orgId, table.importBatchId),
    index('bsl_unreconciled_idx').on(table.orgId, table.companyId, table.isReconciled),
    check('bsl_org_not_empty', sql`org_id <> ''`),
    check('bsl_match_confidence_valid', sql`match_confidence IS NULL OR match_confidence IN ('exact', 'high', 'medium', 'low', 'manual')`),
    tenantPolicy(table),
  ],
);

export type BankStatementLine = typeof bankStatementLines.$inferSelect;
export type NewBankStatementLine = typeof bankStatementLines.$inferInsert;
