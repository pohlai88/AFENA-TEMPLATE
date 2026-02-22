import { text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from './erp-entity';

/**
 * Document entity columns — superset of erpEntityColumns.
 *
 * Adds lifecycle state machine columns:
 * - docStatus: draft → submitted → cancelled (enforced by kernel, not DB)
 * - submittedAt / submittedBy: submission checkpoint
 * - cancelledAt / cancelledBy: cancellation record
 * - amendedFromId: links amended doc to its predecessor
 *
 * Usage: spread into pgTable column definition:
 *   pgTable('invoices', { ...docEntityColumns, invoiceNo: text('invoice_no') })
 */
export const docEntityColumns = {
  ...erpEntityColumns,
  docStatus: text('doc_status').notNull().default('draft'),
  submittedAt: timestamp('submitted_at', { withTimezone: true }),
  submittedBy: text('submitted_by'),
  cancelledAt: timestamp('cancelled_at', { withTimezone: true }),
  cancelledBy: text('cancelled_by'),
  amendedFromId: uuid('amended_from_id'),
} as const;
