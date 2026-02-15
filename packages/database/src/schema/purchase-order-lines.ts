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
 * Purchase order lines — line items for purchase orders.
 *
 * Transactional Spine Migration 0036: Buying Cycle.
 * - Mirror of sales_order_lines with receivedQty/billedQty
 * 
 * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.
 */
export const purchaseOrderLines = pgTable(
  'purchase_order_lines',
  {
    ...baseEntityColumns,
    purchaseOrderId: uuid('purchase_order_id').notNull(),
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
    costCenterId: uuid('cost_center_id'),
    projectId: uuid('project_id'),
    warehouseId: uuid('warehouse_id'),
    receivedQty: numeric('received_qty', { precision: 20, scale: 6 }).notNull().default('0'),
    billedQty: numeric('billed_qty', { precision: 20, scale: 6 }).notNull().default('0'),
    postingDate: timestamp('posting_date', { withTimezone: true }),
    sourceDocType: text('source_doc_type'),
    sourceLineId: uuid('source_line_id'),
    memo: text('memo'),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    uniqueIndex('pol_org_order_line_uniq').on(table.orgId, table.purchaseOrderId, table.lineNo),
    index('pol_org_order_idx').on(table.orgId, table.purchaseOrderId),
    index('pol_org_item_idx').on(table.orgId, table.itemId),
    index('pol_org_item_posting_idx').on(table.orgId, table.itemId, table.postingDate),
    check('pol_org_not_empty', sql`org_id <> ''`),
    check('pol_net_check', sql`net_minor = amount_minor - discount_minor + tax_minor`),
    check('pol_amount_non_negative', sql`amount_minor >= 0`),
    tenantPolicy(table),
  ],
);

export type PurchaseOrderLine = typeof purchaseOrderLines.$inferSelect;
export type NewPurchaseOrderLine = typeof purchaseOrderLines.$inferInsert;
