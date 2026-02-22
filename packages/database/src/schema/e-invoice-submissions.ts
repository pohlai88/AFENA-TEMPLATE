import { sql } from 'drizzle-orm';
import { check, index, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { erpIndexes } from '../helpers/standard-indexes';

export const eInvoiceSubmissions = pgTable(
  'e_invoice_submissions',
  {
    ...erpEntityColumns,
    eInvoiceId: uuid('e_invoice_id').notNull(),
    submissionId: text('submission_id').notNull(),
    accessPoint: text('access_point').notNull(),
    submittedAt: timestamp('submitted_at', { withTimezone: true }).notNull(),
    clearanceStatus: text('clearance_status').notNull().default('pending'),
    validationErrors: jsonb('validation_errors')
      .notNull()
      .default(sql`'[]'::jsonb`),
    clearedAt: timestamp('cleared_at', { withTimezone: true }),
  },
  (t) => [
    ...erpIndexes('e_invoice_submissions', t),
    index('e_invoice_submissions_org_invoice_idx').on(t.orgId, t.eInvoiceId),
    index('e_invoice_submissions_org_status_idx').on(t.orgId, t.clearanceStatus),
    check(
      'e_invoice_submissions_valid_status',
      sql`clearance_status IN ('cleared', 'rejected', 'pending')`,
    ),
  ],
);

export type EInvoiceSubmissionRow = typeof eInvoiceSubmissions.$inferSelect;
export type NewEInvoiceSubmissionRow = typeof eInvoiceSubmissions.$inferInsert;
