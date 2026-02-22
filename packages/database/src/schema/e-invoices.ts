import { sql } from 'drizzle-orm';
import { check, index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { currencyCodeStrict, moneyMinor } from '../helpers/field-types';
import { erpIndexes } from '../helpers/standard-indexes';

export const eInvoices = pgTable(
  'e_invoices',
  {
    ...erpEntityColumns,
    invoiceNo: text('invoice_no').notNull(),
    format: text('format').notNull(),
    recipientId: uuid('recipient_id').notNull(),
    totalMinor: moneyMinor('total_minor'),
    currencyCode: currencyCodeStrict('currency_code'),
    issueDate: text('issue_date').notNull(),
    status: text('status').notNull().default('draft'),
    sourceInvoiceId: uuid('source_invoice_id'),
    issuedAt: timestamp('issued_at', { withTimezone: true }),
  },
  (t) => [
    ...erpIndexes('e_invoices', t),
    index('e_invoices_org_invoice_no_idx').on(t.orgId, t.invoiceNo),
    index('e_invoices_org_status_idx').on(t.orgId, t.status),
    index('e_invoices_org_recipient_idx').on(t.orgId, t.recipientId),
    check(
      'e_invoices_valid_format',
      sql`format IN ('ubl', 'peppol-bis', 'myinvois', 'factur-x', 'xrechnung')`,
    ),
    check(
      'e_invoices_valid_status',
      sql`status IN ('draft', 'issued', 'submitted', 'cleared', 'rejected')`,
    ),
    check('e_invoices_issue_date_format', sql`issue_date ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'`),
  ],
);

export type EInvoiceRow = typeof eInvoices.$inferSelect;
export type NewEInvoiceRow = typeof eInvoices.$inferInsert;
