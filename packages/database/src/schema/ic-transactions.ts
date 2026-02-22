/**
 * Intercompany Transactions Table
 *
 * Records of intercompany transactions between related entities.
 * Used for IC elimination during consolidation and TP documentation.
 * Missing sub-ledger table — Phase 3, step 17.
 */
import { sql } from 'drizzle-orm';
import { bigint, check, date, index, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { docEntityColumns } from '../helpers/doc-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const icTransactions = pgTable(
  'ic_transactions',
  {
    ...docEntityColumns,

    /** IC transaction reference number */
    transactionNo: text('transaction_no'),
    /** Type: 'sale', 'purchase', 'service', 'loan', 'dividend', 'management-fee', 'royalty' */
    transactionType: text('transaction_type').notNull(),
    /** Initiating company ID */
    fromCompanyId: uuid('from_company_id').notNull(),
    /** Receiving company ID */
    toCompanyId: uuid('to_company_id').notNull(),
    /** Transaction amount in minor units */
    amountMinor: bigint('amount_minor', { mode: 'number' }).notNull(),
    /** Currency code */
    currencyCode: text('currency_code').notNull().default('MYR'),
    /** Transaction date */
    transactionDate: date('transaction_date').notNull(),
    /** Matching status: 'unmatched', 'matched', 'disputed', 'eliminated' */
    matchStatus: text('match_status').notNull().default('unmatched'),
    /** Matching partner transaction ID */
    matchedTransactionId: uuid('matched_transaction_id'),
    /** Source document reference */
    sourceDocRef: text('source_doc_ref'),
    /** Description / memo */
    description: text('description'),
  },
  (table) => [
    tenantPk(table),
    index('ict_org_id_idx').on(table.orgId, table.id),
    index('ict_org_created_idx').on(table.orgId, table.createdAt),
    // Lookup by company pair
    index('ict_from_to_idx').on(table.orgId, table.fromCompanyId, table.toCompanyId),
    // Lookup by match status
    index('ict_match_status_idx').on(table.orgId, table.matchStatus),
    // Lookup by date
    index('ict_date_idx').on(table.orgId, table.transactionDate),
    check('ict_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    check(
      'ict_valid_type',
      sql`transaction_type IN ('sale', 'purchase', 'service', 'loan', 'dividend', 'management-fee', 'royalty')`,
    ),
    check(
      'ict_valid_match',
      sql`match_status IN ('unmatched', 'matched', 'disputed', 'eliminated')`,
    ),
    check('ict_different_companies', sql`from_company_id <> to_company_id`),

    tenantPolicy(table),
  ],
);

export type IcTransaction = typeof icTransactions.$inferSelect;
export type NewIcTransaction = typeof icTransactions.$inferInsert;
