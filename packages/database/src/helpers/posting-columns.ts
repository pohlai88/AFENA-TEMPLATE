import { text, timestamp, uuid } from 'drizzle-orm/pg-core';

/**
 * Posting columns — shared across all postable document headers.
 *
 * Transactional Spine v6.3:
 * - postingStatus: 6-state enum (unposted/posting/posted/failed/reversing/reversed) — P-08
 * - postingDate: partition key candidate, denormalized for query discipline — §3.14
 * - postedAt/postedBy: timestamp + actor for posting event
 * - postingBatchId: business grouping (user-set) — P-05
 * - postingError lives on doc_postings only (P-07), NOT here
 *
 * Usage: spread into pgTable column definition alongside docEntityColumns:
 *   pgTable('sales_invoices', { ...docEntityColumns, ...postingColumns, ... })
 */
export const postingColumns = {
  postingStatus: text('posting_status').notNull().default('unposted'),
  postingDate: timestamp('posting_date', { withTimezone: true }),
  postedAt: timestamp('posted_at', { withTimezone: true }),
  postedBy: text('posted_by'),
  postingBatchId: uuid('posting_batch_id'),
} as const;
