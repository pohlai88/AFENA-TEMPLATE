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
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

import { baseEntityColumns } from '../helpers/base-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Quotation lines — line items for quotations.
 *
 * Transactional Spine Migration 0037.
 * - No posting_date (quotations are never posted)
 * - net CHECK still applies
 * 
 * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.
 */
export const quotationLines = pgTable(
  'quotation_lines',
  {
    ...baseEntityColumns,
    quotationId: uuid('quotation_id').notNull(),
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
    memo: text('memo'),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    uniqueIndex('qtnl_org_quotation_line_uniq').on(table.orgId, table.quotationId, table.lineNo),
    index('qtnl_org_quotation_idx').on(table.orgId, table.quotationId),
    index('qtnl_org_item_idx').on(table.orgId, table.itemId),
    check('qtnl_org_not_empty', sql`org_id <> ''`),
    check('qtnl_net_check', sql`net_minor = amount_minor - discount_minor + tax_minor`),
    check('qtnl_amount_non_negative', sql`amount_minor >= 0`),
    tenantPolicy(table),
  ],
);

export type QuotationLine = typeof quotationLines.$inferSelect;
export type NewQuotationLine = typeof quotationLines.$inferInsert;
