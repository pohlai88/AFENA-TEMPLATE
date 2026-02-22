/**
 * Journal Entries Table
 *
 * General ledger journal entry headers. Each entry contains one or more journal lines
 * that must balance (Σ debits = Σ credits). Follows the posting lifecycle:
 * unposted → posting → posted → reversing → reversed
 *
 * Immutable after posting (enforced by reject_posted_mutation trigger).
 * Period close enforced by reject_closed_period_posting trigger.
 */
import { sql } from 'drizzle-orm';
import { bigint, check, date, index, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { docEntityColumns } from '../helpers/doc-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const journalEntries = pgTable(
  'journal_entries',
  {
    ...docEntityColumns,

    /** Journal entry number (allocated by doc-number service) */
    entryNo: text('entry_no'),
    /** Entry type: manual, auto (system-generated), reversal */
    entryType: text('entry_type').notNull().default('manual'),
    /** Posting status lifecycle */
    postingStatus: text('posting_status').notNull().default('unposted'),
    /** Date the entry is posted to the ledger */
    postingDate: date('posting_date'),
    /** Timestamp when posting was completed */
    postedAt: timestamp('posted_at', { withTimezone: true }),
    /** User who posted the entry */
    postedBy: text('posted_by'),
    /** Description / memo for the journal entry */
    memo: text('memo'),
    /** Source document type (e.g., 'sales_invoice', 'payment', 'manual') */
    sourceType: text('source_type'),
    /** Source document ID (FK to the originating document) */
    sourceId: uuid('source_id'),
    /** Currency for this journal entry */
    currency: text('currency').notNull().default('MYR'),
    /** Total debit amount in minor units (denormalized for quick lookups) */
    totalDebitMinor: bigint('total_debit_minor', { mode: 'number' }).notNull().default(0),
    /** Total credit amount in minor units (denormalized for quick lookups) */
    totalCreditMinor: bigint('total_credit_minor', { mode: 'number' }).notNull().default(0),
    /** Reversal reference: ID of the entry this reverses (null if not a reversal) */
    reversesEntryId: uuid('reverses_entry_id'),
    /** External source system identifier */
    externalSource: text('external_source'),
    /** External source document ID */
    externalId: text('external_id'),
  },
  (table) => [
    tenantPk(table),
    index('je_org_id_idx').on(table.orgId, table.id),
    index('je_org_created_idx').on(table.orgId, table.createdAt),
    // Lookup by company + posting date
    index('je_company_posting_idx').on(table.orgId, table.companyId, table.postingDate),
    // Lookup by entry number
    index('je_entry_no_idx').on(table.orgId, table.entryNo),
    // Lookup by source document
    index('je_source_idx').on(table.orgId, table.sourceType, table.sourceId),
    // Unique entry number per org (when assigned)
    uniqueIndex('je_unique_entry_no_idx')
      .on(table.orgId, table.entryNo)
      .where(sql`entry_no IS NOT NULL`),
    check('je_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    check('je_valid_posting_status', sql`posting_status IN ('unposted', 'posting', 'posted', 'reversing', 'reversed')`),
    check('je_valid_entry_type', sql`entry_type IN ('manual', 'auto', 'reversal')`),
    check('je_balance', sql`total_debit_minor = total_credit_minor`),

    tenantPolicy(table),
  ],
);

export type JournalEntry = typeof journalEntries.$inferSelect;
export type NewJournalEntry = typeof journalEntries.$inferInsert;
