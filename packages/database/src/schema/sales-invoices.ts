import { sql } from 'drizzle-orm';
import {
  bigint,
  boolean,
  check,
  date,
  index,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

import { docEntityColumns } from '../helpers/doc-entity';
import { postingColumns } from '../helpers/posting-columns';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Sales invoices — AR document, proves posting engine + GL + outstanding.
 *
 * Transactional Spine Migration 0033.
 * - 6-state posting_status (P-08)
 * - company_id NOT NULL (§3.12)
 * - is_tax_included flag (§3.11)
 * - Partial aging indexes for AR (R2.6)
 * - Statement index for customer statements
 * - Header-side customer analytics index (v6.2 nit)
 * - Totals computed from SUM(lines) on every save (P-09, P-09a)
 */
export const salesInvoices = pgTable(
  'sales_invoices',
  {
    ...docEntityColumns,
    ...postingColumns,
    docNo: text('doc_no'),
    customerId: uuid('customer_id').notNull(),
    dueDate: date('due_date'),
    currencyCode: text('currency_code').notNull().default('MYR'),
    exchangeRate: numeric('exchange_rate', { precision: 12, scale: 6 }).default('1'),
    totalMinor: bigint('total_minor', { mode: 'number' }).notNull().default(0),
    discountMinor: bigint('discount_minor', { mode: 'number' }).notNull().default(0),
    taxMinor: bigint('tax_minor', { mode: 'number' }).notNull().default(0),
    grandTotalMinor: bigint('grand_total_minor', { mode: 'number' }).notNull().default(0),
    paidMinor: bigint('paid_minor', { mode: 'number' }).notNull().default(0),
    outstandingMinor: bigint('outstanding_minor', { mode: 'number' }).notNull().default(0),
    coaReceivableId: uuid('coa_receivable_id'),
    isTaxIncluded: boolean('is_tax_included').notNull().default(false),
    billingAddressId: uuid('billing_address_id'),
    shippingAddressId: uuid('shipping_address_id'),
    paymentTerms: text('payment_terms'),
    memo: text('memo'),
  },
  (table) => [
    uniqueIndex('si_org_doc_no_uniq').on(table.orgId, table.docNo),
    index('si_org_customer_posting_idx').on(table.orgId, table.customerId, table.postingDate),
    index('si_org_posting_date_idx').on(table.orgId, table.postingDate),
    index('si_org_due_date_idx').on(table.orgId, table.dueDate),
    index('si_org_doc_status_idx').on(table.orgId, table.docStatus, table.updatedAt),
    index('si_org_posting_status_idx').on(table.orgId, table.postingStatus, table.postingDate),
    // Partial aging indexes (R2.6)
    index('si_org_outstanding_idx')
      .on(table.orgId, table.outstandingMinor)
      .where(sql`outstanding_minor > 0`),
    index('si_org_due_outstanding_idx')
      .on(table.orgId, table.dueDate, table.outstandingMinor)
      .where(sql`outstanding_minor > 0`),
    // Statement index: AR aging + customer statement
    index('si_org_customer_due_stmt_idx')
      .on(table.orgId, table.customerId, table.dueDate)
      .where(sql`outstanding_minor > 0`),
    // Header-side customer analytics (v6.2 nit)
    index('si_org_customer_analytics_idx').on(
      table.orgId,
      table.customerId,
      table.postingDate,
      table.id,
    ),
    check('si_org_not_empty', sql`org_id <> ''`),
    check('si_company_required', sql`company_id IS NOT NULL`),
    check('si_total_non_negative', sql`total_minor >= 0`),
    check('si_tax_non_negative', sql`tax_minor >= 0`),
    check('si_grand_total_non_negative', sql`grand_total_minor >= 0`),
    check('si_paid_non_negative', sql`paid_minor >= 0`),
    check('si_outstanding_non_negative', sql`outstanding_minor >= 0`),
    check(
      'si_posting_status_valid',
      sql`posting_status IN ('unposted', 'posting', 'posted', 'failed', 'reversing', 'reversed')`,
    ),
    tenantPolicy(table),
  ],
);

export type SalesInvoice = typeof salesInvoices.$inferSelect;
export type NewSalesInvoice = typeof salesInvoices.$inferInsert;
