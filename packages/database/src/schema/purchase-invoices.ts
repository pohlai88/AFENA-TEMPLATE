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
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

import { docEntityColumns } from '../helpers/doc-entity';
import { postingColumns } from '../helpers/posting-columns';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Purchase invoices — AP document (mirror of sales_invoices).
 *
 * Transactional Spine Migration 0036: Buying Cycle.
 * - 6-state posting_status (P-08)
 * - company_id NOT NULL (§3.12)
 * - AP aging indexes (mirror of AR)
 * - Statement index for supplier statements
 */
export const purchaseInvoices = pgTable(
  'purchase_invoices',
  {
    ...docEntityColumns,
    ...postingColumns,
    docNo: text('doc_no'),
    supplierId: uuid('supplier_id').notNull(),
    dueDate: date('due_date'),
    currencyCode: text('currency_code').notNull().default('MYR'),
    exchangeRate: numeric('exchange_rate', { precision: 12, scale: 6 }).default('1'),
    totalMinor: bigint('total_minor', { mode: 'number' }).notNull().default(0),
    discountMinor: bigint('discount_minor', { mode: 'number' }).notNull().default(0),
    taxMinor: bigint('tax_minor', { mode: 'number' }).notNull().default(0),
    grandTotalMinor: bigint('grand_total_minor', { mode: 'number' }).notNull().default(0),
    paidMinor: bigint('paid_minor', { mode: 'number' }).notNull().default(0),
    outstandingMinor: bigint('outstanding_minor', { mode: 'number' }).notNull().default(0),
    coaPayableId: uuid('coa_payable_id'),
    isTaxIncluded: boolean('is_tax_included').notNull().default(false),
    billingAddressId: uuid('billing_address_id'),
    paymentTerms: text('payment_terms'),
    memo: text('memo'),
  },
  (table) => [
    uniqueIndex('pi_org_doc_no_uniq').on(table.orgId, table.docNo),
    index('pi_org_supplier_posting_idx').on(table.orgId, table.supplierId, table.postingDate),
    index('pi_org_posting_date_idx').on(table.orgId, table.postingDate),
    index('pi_org_due_date_idx').on(table.orgId, table.dueDate),
    index('pi_org_doc_status_idx').on(table.orgId, table.docStatus, table.updatedAt),
    index('pi_org_posting_status_idx').on(table.orgId, table.postingStatus, table.postingDate),
    // Partial aging indexes (AP mirror of AR)
    index('pi_org_outstanding_idx')
      .on(table.orgId, table.outstandingMinor)
      .where(sql`outstanding_minor > 0`),
    index('pi_org_due_outstanding_idx')
      .on(table.orgId, table.dueDate, table.outstandingMinor)
      .where(sql`outstanding_minor > 0`),
    // Statement index: AP aging + supplier statement
    index('pi_org_supplier_due_stmt_idx')
      .on(table.orgId, table.supplierId, table.dueDate)
      .where(sql`outstanding_minor > 0`),
    check('pi_org_not_empty', sql`org_id <> ''`),
    check('pi_company_required', sql`company_id IS NOT NULL`),
    check('pi_total_non_negative', sql`total_minor >= 0`),
    check('pi_tax_non_negative', sql`tax_minor >= 0`),
    check('pi_grand_total_non_negative', sql`grand_total_minor >= 0`),
    check('pi_paid_non_negative', sql`paid_minor >= 0`),
    check('pi_outstanding_non_negative', sql`outstanding_minor >= 0`),
    check(
      'pi_posting_status_valid',
      sql`posting_status IN ('unposted', 'posting', 'posted', 'failed', 'reversing', 'reversed')`,
    ),
    tenantPolicy(table),
  ],
);

export type PurchaseInvoice = typeof purchaseInvoices.$inferSelect;
export type NewPurchaseInvoice = typeof purchaseInvoices.$inferInsert;
