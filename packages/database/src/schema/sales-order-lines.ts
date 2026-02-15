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
 * Sales order lines — line items for sales orders.
 *
 * Transactional Spine Migration 0035.
 * - Shared line contract with net CHECK
 * - deliveredQty / billedQty for fulfillment tracking
 * - posting_date denormalized for partition readiness
 * 
 * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.
 */
export const salesOrderLines = pgTable(
  'sales_order_lines',
  {
    ...baseEntityColumns,
    salesOrderId: uuid('sales_order_id').notNull(),
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
    deliveredQty: numeric('delivered_qty', { precision: 20, scale: 6 }).notNull().default('0'),
    billedQty: numeric('billed_qty', { precision: 20, scale: 6 }).notNull().default('0'),
    postingDate: timestamp('posting_date', { withTimezone: true }),
    sourceDocType: text('source_doc_type'),
    sourceLineId: uuid('source_line_id'),
    memo: text('memo'),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    uniqueIndex('sol_org_order_line_uniq').on(table.orgId, table.salesOrderId, table.lineNo),
    index('sol_org_order_idx').on(table.orgId, table.salesOrderId),
    index('sol_org_item_idx').on(table.orgId, table.itemId),
    index('sol_org_item_posting_idx').on(table.orgId, table.itemId, table.postingDate),
    check('sol_org_not_empty', sql`org_id <> ''`),
    check('sol_net_check', sql`net_minor = amount_minor - discount_minor + tax_minor`),
    check('sol_amount_non_negative', sql`amount_minor >= 0`),
    tenantPolicy(table),
  ],
);

export type SalesOrderLine = typeof salesOrderLines.$inferSelect;
export type NewSalesOrderLine = typeof salesOrderLines.$inferInsert;
