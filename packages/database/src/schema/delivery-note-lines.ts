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
 * Delivery note lines — line items for delivery notes.
 *
 * Transactional Spine Migration 0035.
 * - Shared line contract with net CHECK
 * - lot_tracking_id + serial_no for traceability
 * - posting_date denormalized for partition readiness
 */
export const deliveryNoteLines = pgTable(
  'delivery_note_lines',
  {
    ...baseEntityColumns,
    deliveryNoteId: uuid('delivery_note_id').notNull(),
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
    uniqueIndex('dnl_org_note_line_uniq').on(table.orgId, table.deliveryNoteId, table.lineNo),
    index('dnl_org_note_idx').on(table.orgId, table.deliveryNoteId),
    index('dnl_org_item_idx').on(table.orgId, table.itemId),
    index('dnl_org_item_posting_idx').on(table.orgId, table.itemId, table.postingDate),
    check('dnl_org_not_empty', sql`org_id <> ''`),
    check('dnl_net_check', sql`net_minor = amount_minor - discount_minor + tax_minor`),
    check('dnl_amount_non_negative', sql`amount_minor >= 0`),
    tenantPolicy(table),
  ],
);

export type DeliveryNoteLine = typeof deliveryNoteLines.$inferSelect;
export type NewDeliveryNoteLine = typeof deliveryNoteLines.$inferInsert;
