import { sql } from 'drizzle-orm';
import {
  bigint,
  check,
  index,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

import { baseEntityColumns } from '../helpers/base-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Sales invoice lines — line items for sales invoices.
 *
 * Transactional Spine Migration 0033.
 * - Shared line contract: item, qty, UOM, rate, amounts, tax
 * - net_minor = amount_minor - discount_minor + tax_minor (CHECK)
 * - posting_date denormalized for partition readiness (§3.14)
 * - company_id denormalized for line analytics index
 * - Line analytics index: (org_id, company_id, posting_date DESC, item_id)
 */
export const salesInvoiceLines = pgTable(
  'sales_invoice_lines',
  {
    ...baseEntityColumns,
    salesInvoiceId: uuid('sales_invoice_id').notNull(),
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
    coaIncomeId: uuid('coa_income_id'),
    costCenterId: uuid('cost_center_id'),
    projectId: uuid('project_id'),
    warehouseId: uuid('warehouse_id'),
    postingDate: timestamp('posting_date', { withTimezone: true }),
    sourceDocType: text('source_doc_type'),
    sourceLineId: uuid('source_line_id'),
    memo: text('memo'),
  },
  (table) => [
    uniqueIndex('sil_org_invoice_line_uniq').on(
      table.orgId,
      table.salesInvoiceId,
      table.lineNo,
    ),
    index('sil_org_invoice_idx').on(table.orgId, table.salesInvoiceId),
    index('sil_org_item_idx').on(table.orgId, table.itemId),
    index('sil_org_item_posting_idx').on(table.orgId, table.itemId, table.postingDate),
    // Line analytics index (v6.2): top items per company reports
    index('sil_org_company_analytics_idx').on(
      table.orgId,
      table.companyId,
      table.postingDate,
      table.itemId,
    ),
    check('sil_org_not_empty', sql`org_id <> ''`),
    check(
      'sil_net_check',
      sql`net_minor = amount_minor - discount_minor + tax_minor`,
    ),
    check('sil_amount_non_negative', sql`amount_minor >= 0`),
    tenantPolicy(table),
  ],
);

export type SalesInvoiceLine = typeof salesInvoiceLines.$inferSelect;
export type NewSalesInvoiceLine = typeof salesInvoiceLines.$inferInsert;
