/**
 * Supplier Invoices Table
 *
 * Accounts Payable sub-ledger for supplier invoices.
 * Tracks the full lifecycle from receipt to payment.
 * Missing sub-ledger table — Phase 3, step 17.
 */
import { sql } from 'drizzle-orm';
import { bigint, check, date, index, pgTable, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { docEntityColumns } from '../helpers/doc-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const supplierInvoices = pgTable(
  'supplier_invoices',
  {
    ...docEntityColumns,

    /** Invoice number (from supplier) */
    invoiceNo: text('invoice_no').notNull(),
    /** Internal document number */
    internalDocNo: text('internal_doc_no'),
    /** FK to suppliers / contacts */
    supplierId: uuid('supplier_id').notNull(),
    /** Invoice date */
    invoiceDate: date('invoice_date').notNull(),
    /** Due date */
    dueDate: date('due_date').notNull(),
    /** Invoice type: 'standard', 'credit-note', 'debit-note', 'prepayment' */
    invoiceType: text('invoice_type').notNull().default('standard'),
    /** Gross amount in minor units */
    grossAmountMinor: bigint('gross_amount_minor', { mode: 'number' }).notNull(),
    /** Tax amount in minor units */
    taxAmountMinor: bigint('tax_amount_minor', { mode: 'number' }).notNull().default(0),
    /** Net amount in minor units (gross - tax) */
    netAmountMinor: bigint('net_amount_minor', { mode: 'number' }).notNull(),
    /** Amount paid so far in minor units */
    paidAmountMinor: bigint('paid_amount_minor', { mode: 'number' }).notNull().default(0),
    /** Currency code */
    currencyCode: text('currency_code').notNull().default('MYR'),
    /** Payment status: 'unpaid', 'partial', 'paid', 'overpaid' */
    paymentStatus: text('payment_status').notNull().default('unpaid'),
    /** Payment terms (e.g., 'NET30', 'NET60') */
    paymentTerms: text('payment_terms'),
    /** Purchase order reference */
    poReference: text('po_reference'),
    /** Description / memo */
    description: text('description'),
  },
  (table) => [
    tenantPk(table),
    index('si_org_id_idx').on(table.orgId, table.id),
    index('si_org_created_idx').on(table.orgId, table.createdAt),
    // Lookup by supplier
    index('si_supplier_idx').on(table.orgId, table.supplierId),
    // Lookup by due date (aging report)
    index('si_due_date_idx').on(table.orgId, table.dueDate, table.paymentStatus),
    // Lookup by payment status
    index('si_payment_status_idx').on(table.orgId, table.paymentStatus),
    // Duplicate detection: supplier + invoice number + gross amount
    uniqueIndex('si_dup_detect_idx').on(
      table.orgId,
      table.supplierId,
      table.invoiceNo,
      table.grossAmountMinor,
    ),
    check('si_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    check(
      'si_valid_type',
      sql`invoice_type IN ('standard', 'credit-note', 'debit-note', 'prepayment')`,
    ),
    check(
      'si_valid_payment_status',
      sql`payment_status IN ('unpaid', 'partial', 'paid', 'overpaid')`,
    ),

    tenantPolicy(table),
  ],
);

export type SupplierInvoice = typeof supplierInvoices.$inferSelect;
export type NewSupplierInvoice = typeof supplierInvoices.$inferInsert;
