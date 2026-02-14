import { sql } from 'drizzle-orm';
import { check, index, pgTable, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { docEntityColumns } from '../helpers/doc-entity';
import { postingColumns } from '../helpers/posting-columns';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Goods receipts — inbound goods document (mirror of delivery_notes).
 *
 * Transactional Spine Migration 0036: Buying Cycle.
 * - 6-state posting_status (P-08)
 * - company_id NOT NULL (§3.12)
 * - warehouseId for stock movement trigger
 */
export const goodsReceipts = pgTable(
  'goods_receipts',
  {
    ...docEntityColumns,
    ...postingColumns,
    docNo: text('doc_no'),
    supplierId: uuid('supplier_id').notNull(),
    warehouseId: uuid('warehouse_id'),
    memo: text('memo'),
  },
  (table) => [
    uniqueIndex('gr_org_doc_no_uniq').on(table.orgId, table.docNo),
    index('gr_org_supplier_posting_idx').on(table.orgId, table.supplierId, table.postingDate),
    index('gr_org_posting_date_idx').on(table.orgId, table.postingDate),
    index('gr_org_posting_status_idx').on(table.orgId, table.postingStatus, table.postingDate),
    check('gr_org_not_empty', sql`org_id <> ''`),
    check('gr_company_required', sql`company_id IS NOT NULL`),
    check(
      'gr_posting_status_valid',
      sql`posting_status IN ('unposted', 'posting', 'posted', 'failed', 'reversing', 'reversed')`,
    ),
    tenantPolicy(table),
  ],
);

export type GoodsReceipt = typeof goodsReceipts.$inferSelect;
export type NewGoodsReceipt = typeof goodsReceipts.$inferInsert;
