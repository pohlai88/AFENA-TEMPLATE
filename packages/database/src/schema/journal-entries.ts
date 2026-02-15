import { sql } from 'drizzle-orm';
import { check, foreignKey, index, jsonb, pgTable, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { docEntityColumns } from '../helpers/doc-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

import { companies } from './companies';

/**
 * Journal entries — the header for double-entry accounting transactions.
 *
 * RULE C-01: Journal entries are LEGAL-scoped (company-specific GL postings).
 * PRD Phase B #7:
 * - Uses docEntityColumns (lifecycle: draft → submitted → active → cancelled → amended)
 * - entry_type CHECK: manual, auto (system-generated from source docs)
 * - source_type + source_id: link back to originating document (invoice, payment, etc.)
 * - posted_at: the accounting-effective timestamp (used for period matching)
 * - Append-only once posted (DB trigger via reject_posted_mutation)
 * 
 * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.
 */
export const journalEntries = pgTable(
  'journal_entries',
  {
    ...docEntityColumns,
    entryNo: text('entry_no'),
    entryType: text('entry_type').notNull().default('manual'),
    description: text('description'),
    postedAt: timestamp('posted_at', { withTimezone: true }),
    currencyCode: text('currency_code').notNull().default('MYR'),
    fxRate: text('fx_rate'),
    sourceType: text('source_type'),
    sourceId: uuid('source_id'),
    reversalOfId: uuid('reversal_of_id'),
    memo: text('memo'),
    tags: jsonb('tags').default(sql`'[]'::jsonb`),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    foreignKey({
      columns: [table.orgId, table.companyId],
      foreignColumns: [companies.orgId, companies.id],
      name: 'journal_entries_company_fk',
    }),
    index('journal_entries_org_id_idx').on(table.orgId, table.id),
    index('journal_entries_org_company_idx').on(table.orgId, table.companyId),
    index('journal_entries_org_posted_idx').on(table.orgId, table.postedAt),
    index('journal_entries_source_idx').on(table.orgId, table.sourceType, table.sourceId),
    check('journal_entries_org_not_empty', sql`org_id <> ''`),
    check('journal_entries_entry_type_valid', sql`entry_type IN ('manual', 'auto')`),
    tenantPolicy(table),
  ],
);

export type JournalEntry = typeof journalEntries.$inferSelect;
export type NewJournalEntry = typeof journalEntries.$inferInsert;
