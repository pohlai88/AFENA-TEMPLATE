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
 * Goods receipt lines — line items for goods receipts.
 *
 * Transactional Spine Migration 0036: Buying Cycle.
 * - Mirror of delivery_note_lines with lot/serial tracking
 */
export const goodsReceiptLines = pgTable(
  'goods_receipt_lines',
  {
    ...baseEntityColumns,
    goodsReceiptId: uuid('goods_receipt_id').notNull(),
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
    warehouseId: uuid('warehouse_id'),
    lotTrackingId: uuid('lot_tracking_id'),
    serialNo: text('serial_no'),
    postingDate: timestamp('posting_date', { withTimezone: true }),
    sourceDocType: text('source_doc_type'),
    sourceLineId: uuid('source_line_id'),
    memo: text('memo'),
  },
  (table) => [
    uniqueIndex('grl_org_receipt_line_uniq').on(table.orgId, table.goodsReceiptId, table.lineNo),
    index('grl_org_receipt_idx').on(table.orgId, table.goodsReceiptId),
    index('grl_org_item_idx').on(table.orgId, table.itemId),
    index('grl_org_item_posting_idx').on(table.orgId, table.itemId, table.postingDate),
    check('grl_org_not_empty', sql`org_id <> ''`),
    check('grl_net_check', sql`net_minor = amount_minor - discount_minor + tax_minor`),
    check('grl_amount_non_negative', sql`amount_minor >= 0`),
    tenantPolicy(table),
  ],
);

export type GoodsReceiptLine = typeof goodsReceiptLines.$inferSelect;
export type NewGoodsReceiptLine = typeof goodsReceiptLines.$inferInsert;
