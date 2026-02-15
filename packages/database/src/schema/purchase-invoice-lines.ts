import { sql } from 'drizzle-orm';
import {
  bigint,
  check,
  index,
  integer,
  numeric,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

import { baseEntityColumns } from '../helpers/base-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Purchase invoice lines — line items for purchase invoices.
 *
 * Transactional Spine Migration 0036: Buying Cycle.
 * - Mirror of sales_invoice_lines with coa_expense_id
 * 
 * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.
 */
export const purchaseInvoiceLines = pgTable(
  'purchase_invoice_lines',
  {
    ...baseEntityColumns,
    purchaseInvoiceId: uuid('purchase_invoice_id').notNull(),
    companyId: uuid('company_id').notNull(),
    lineNo: integer('line_no').notNull(),
    itemId: uuid('item_id'),
    itemCode: text('item_code'),
    itemName: text('item_name'),
    description: text('description'),
    qty: numeric('qty', { precision: 20, scale: 6 }).notNull().default('1'),
    uomId: uuid('uom_id'),
    rateMinor: bigint('rate_minor', { mode: 'number' }).notNull().default(0),
    amountMinor: bigint('amount_minor', { mode: 'number' }).notNull().default(0),
    discountMinor: bigint('discount_minor', { mode: 'number' }).notNull().default(0),
    taxMinor: bigint('tax_minor', { mode: 'number' }).notNull().default(0),
    netMinor: bigint('net_minor', { mode: 'number' }).notNull().default(0),
    taxRateId: uuid('tax_rate_id'),
    coaExpenseId: uuid('coa_expense_id'),
    costCenterId: uuid('cost_center_id'),
    projectId: uuid('project_id'),
    warehouseId: uuid('warehouse_id'),
    postingDate: timestamp('posting_date', { withTimezone: true }),
    sourceDocType: text('source_doc_type'),
    sourceLineId: uuid('source_line_id'),
    memo: text('memo'),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    uniqueIndex('pil_org_invoice_line_uniq').on(
      table.orgId,
      table.purchaseInvoiceId,
      table.lineNo,
    ),
    index('pil_org_invoice_idx').on(table.orgId, table.purchaseInvoiceId),
    index('pil_org_item_idx').on(table.orgId, table.itemId),
    index('pil_org_item_posting_idx').on(table.orgId, table.itemId, table.postingDate),
    check('pil_org_not_empty', sql`org_id <> ''`),
    check('pil_net_check', sql`net_minor = amount_minor - discount_minor + tax_minor`),
    check('pil_amount_non_negative', sql`amount_minor >= 0`),
    tenantPolicy(table),
  ],
);

export type PurchaseInvoiceLine = typeof purchaseInvoiceLines.$inferSelect;
export type NewPurchaseInvoiceLine = typeof purchaseInvoiceLines.$inferInsert;
