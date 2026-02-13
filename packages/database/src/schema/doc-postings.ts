import { sql } from 'drizzle-orm';
import { check, index, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { baseEntityColumns } from '../helpers/base-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Doc postings — canonical posting state registry (P-01).
 *
 * Transactional Spine Migration 0032: Posting Bridge.
 * - Single source of truth for posting status (P-01)
 * - Claim via INSERT ON CONFLICT (org_id, idempotency_key) DO NOTHING (P-02)
 * - 5-state: posting/posted/failed/reversing/reversed (P-08)
 * - No-WHERE idempotency unique: one row per key, ever (v6.3)
 * - Active posting unique includes 'reversing' to prevent concurrent reversal + repost
 * - posting_batch_id = business grouping, posting_run_id = execution attempt (P-05)
 * - Error details live here, not on doc headers (P-07)
 */
export const docPostings = pgTable(
  'doc_postings',
  {
    ...baseEntityColumns,
    docType: text('doc_type').notNull(),
    docId: uuid('doc_id').notNull(),
    status: text('status').notNull().default('posting'),
    idempotencyKey: text('idempotency_key').notNull(),
    postingBatchId: uuid('posting_batch_id'),
    postingRunId: uuid('posting_run_id'),
    journalEntryId: uuid('journal_entry_id'),
    stockBatchId: uuid('stock_batch_id'),
    postedAt: timestamp('posted_at', { withTimezone: true }),
    postedBy: text('posted_by'),
    reversedAt: timestamp('reversed_at', { withTimezone: true }),
    reversedBy: text('reversed_by'),
    reversalPostingId: uuid('reversal_posting_id'),
    errorMessage: text('error_message'),
  },
  (table) => [
    // v6.3 critical: no-WHERE idempotency unique — one row per key, ever
    uniqueIndex('doc_postings_org_idemp_uniq').on(
      table.orgId,
      table.idempotencyKey,
    ),
    // v6.3: active posting unique includes 'reversing'
    uniqueIndex('doc_postings_org_doc_active_uniq')
      .on(table.orgId, table.docType, table.docId)
      .where(sql`status IN ('posting', 'posted', 'reversing')`),
    index('doc_postings_org_batch_idx').on(table.orgId, table.postingBatchId),
    index('doc_postings_org_run_idx').on(table.orgId, table.postingRunId),
    index('doc_postings_org_type_posted_idx').on(
      table.orgId,
      table.docType,
      table.postedAt,
    ),
    index('doc_postings_org_status_idx').on(table.orgId, table.status),
    check('doc_postings_org_not_empty', sql`org_id <> ''`),
    check(
      'doc_postings_status_valid',
      sql`status IN ('posting', 'posted', 'failed', 'reversing', 'reversed')`,
    ),
    tenantPolicy(table),
  ],
);

export type DocPosting = typeof docPostings.$inferSelect;
export type NewDocPosting = typeof docPostings.$inferInsert;
