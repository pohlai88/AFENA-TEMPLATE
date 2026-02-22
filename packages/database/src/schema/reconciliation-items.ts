/**
 * Reconciliation Items Table
 *
 * Individual line items from bank statements matched (or unmatched)
 * against internal transactions (payments, receipts, journals).
 * Missing sub-ledger table — Phase 3, step 17.
 */
import { sql } from 'drizzle-orm';
import { bigint, check, date, index, integer, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const reconciliationItems = pgTable(
  'reconciliation_items',
  {
    ...erpEntityColumns,

    /** FK to bank_statements */
    bankStatementId: uuid('bank_statement_id').notNull(),
    /** Transaction date on the bank statement */
    transactionDate: date('transaction_date').notNull(),
    /** Value date */
    valueDate: date('value_date'),
    /** Amount in minor units (positive = credit, negative = debit) */
    amountMinor: bigint('amount_minor', { mode: 'number' }).notNull(),
    /** Currency code */
    currencyCode: text('currency_code').notNull().default('MYR'),
    /** Bank reference */
    bankReference: text('bank_reference'),
    /** Description from bank */
    bankDescription: text('bank_description'),
    /** Match status: 'unmatched', 'auto-matched', 'manual-matched', 'disputed' */
    matchStatus: text('match_status').notNull().default('unmatched'),
    /** FK to matched internal transaction (payment, receipt, journal) */
    matchedDocumentId: uuid('matched_document_id'),
    /** Type of matched document: 'payment', 'receipt', 'journal', 'transfer' */
    matchedDocumentType: text('matched_document_type'),
    /** Match confidence score (0-100, only for auto-match) */
    matchConfidence: integer('match_confidence'),
    /** Who matched this item */
    matchedBy: text('matched_by'),
  },
  (table) => [
    tenantPk(table),
    index('ri_org_id_idx').on(table.orgId, table.id),
    index('ri_org_created_idx').on(table.orgId, table.createdAt),
    // Lookup by bank statement
    index('ri_statement_idx').on(table.orgId, table.bankStatementId),
    // Lookup by match status
    index('ri_match_status_idx').on(table.orgId, table.matchStatus),
    // Lookup by matched document
    index('ri_matched_doc_idx').on(table.orgId, table.matchedDocumentId),
    check('ri_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    check(
      'ri_valid_match_status',
      sql`match_status IN ('unmatched', 'auto-matched', 'manual-matched', 'disputed')`,
    ),
    check(
      'ri_valid_confidence',
      sql`match_confidence IS NULL OR (match_confidence >= 0 AND match_confidence <= 100)`,
    ),

    tenantPolicy(table),
  ],
);

export type ReconciliationItem = typeof reconciliationItems.$inferSelect;
export type NewReconciliationItem = typeof reconciliationItems.$inferInsert;
