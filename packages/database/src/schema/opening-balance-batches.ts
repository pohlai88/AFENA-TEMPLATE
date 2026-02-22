/**
 * Opening Balance Batches Table
 *
 * Groups opening-balance lines into auditable batches for go-live migration.
 * Each batch can be validated, then posted to the GL as a single journal entry.
 * Uses docEntityColumns for submit/cancel lifecycle.
 *
 * ERPNext equivalent: "Opening Invoice Creation Tool" / "Opening Entry".
 */
import { sql } from 'drizzle-orm';
import { check, date, index, integer, jsonb, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { docEntityColumns } from '../helpers/doc-entity';
import { erpIndexes } from '../helpers/standard-indexes';

export const openingBalanceBatches = pgTable(
  'opening_balance_batches',
  {
    ...docEntityColumns,

    /** Human-readable batch identifier */
    batchNo: text('batch_no'),
    /** Type of opening balance: gl, ar, ap, bank */
    batchType: text('batch_type').notNull(),
    /** The accounting date for the opening entries */
    effectiveDate: date('effective_date').notNull(),
    /** Number of lines in this batch (denormalised for dashboard) */
    lineCount: integer('line_count').notNull().default(0),
    /** Validation workflow state */
    validationStatus: text('validation_status').notNull().default('pending'),
    /** Array of validation error messages (empty when clean) */
    validationErrors: jsonb('validation_errors')
      .notNull()
      .default(sql`'[]'::jsonb`),
    /** FK to journal_entries — set after successful GL posting */
    journalEntryId: uuid('journal_entry_id'),
  },
  (t) => [
    ...erpIndexes('opening_balance_batches', t),

    index('idx__opening_balance_batches__type').on(t.orgId, t.batchType),
    index('idx__opening_balance_batches__effective_date').on(t.orgId, t.effectiveDate),

    check('opening_balance_batches_valid_type', sql`batch_type IN ('gl', 'ar', 'ap', 'bank')`),
    check(
      'opening_balance_batches_valid_validation',
      sql`validation_status IN ('pending', 'validated', 'errors', 'posted')`,
    ),
    check('opening_balance_batches_nonneg_count', sql`line_count >= 0`),
  ],
);

export type OpeningBalanceBatch = typeof openingBalanceBatches.$inferSelect;
export type NewOpeningBalanceBatch = typeof openingBalanceBatches.$inferInsert;
