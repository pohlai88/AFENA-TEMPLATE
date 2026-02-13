import { sql } from 'drizzle-orm';
import { bigint, check, index, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { baseEntityColumns } from '../helpers/base-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Intercompany transactions — paired journal entries between companies.
 *
 * PRD G0.9 + Phase C #13.5:
 * - When company A invoices company B, paired journal entries are created
 * - source_company_id + target_company_id track the two sides
 * - source_journal_entry_id + target_journal_entry_id link to actual JEs
 * - Used for elimination rules in consolidated reporting
 * - amount in minor units (integer)
 */
export const intercompanyTransactions = pgTable(
  'intercompany_transactions',
  {
    ...baseEntityColumns,
    sourceCompanyId: uuid('source_company_id').notNull(),
    targetCompanyId: uuid('target_company_id').notNull(),
    sourceJournalEntryId: uuid('source_journal_entry_id'),
    targetJournalEntryId: uuid('target_journal_entry_id'),
    transactionType: text('transaction_type').notNull(),
    description: text('description'),
    amountMinor: bigint('amount_minor', { mode: 'number' }).notNull(),
    currencyCode: text('currency_code').notNull().default('MYR'),
    fxRate: text('fx_rate'),
    baseAmountMinor: bigint('base_amount_minor', { mode: 'number' }).notNull(),
    status: text('status').notNull().default('pending'),
    memo: text('memo'),
  },
  (table) => [
    index('ic_txn_org_id_idx').on(table.orgId, table.id),
    index('ic_txn_source_company_idx').on(table.orgId, table.sourceCompanyId),
    index('ic_txn_target_company_idx').on(table.orgId, table.targetCompanyId),
    index('ic_txn_source_je_idx').on(table.orgId, table.sourceJournalEntryId),
    index('ic_txn_target_je_idx').on(table.orgId, table.targetJournalEntryId),
    check('ic_txn_org_not_empty', sql`org_id <> ''`),
    check('ic_txn_different_companies', sql`source_company_id <> target_company_id`),
    check('ic_txn_amount_positive', sql`amount_minor > 0`),
    check('ic_txn_type_valid', sql`transaction_type IN ('invoice', 'payment', 'transfer', 'allocation', 'elimination')`),
    check('ic_txn_status_valid', sql`status IN ('pending', 'matched', 'eliminated', 'cancelled')`),
    tenantPolicy(table),
  ],
);

export type IntercompanyTransaction = typeof intercompanyTransactions.$inferSelect;
export type NewIntercompanyTransaction = typeof intercompanyTransactions.$inferInsert;
