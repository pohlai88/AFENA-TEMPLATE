import { sql } from 'drizzle-orm';
import { bigint, check, index, numeric, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { baseEntityColumns } from '../helpers/base-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Stock movements — perpetual inventory ledger (append-only).
 *
 * PRD Phase D #15 + G0.1:
 * - Append-only movements: receipts, issues, transfers, adjustments
 * - Costing: unit_cost stored per movement for FIFO/weighted average
 * - posted_at: partition key candidate (monthly range, insert-time-only)
 * - REVOKE UPDATE/DELETE enforced at DB level
 */
export const stockMovements = pgTable(
  'stock_movements',
  {
    ...baseEntityColumns,
    companyId: uuid('company_id').notNull(),
    siteId: uuid('site_id').notNull(),
    itemId: uuid('item_id').notNull(),
    movementType: text('movement_type').notNull(),
    qty: numeric('qty', { precision: 20, scale: 6 }).notNull(),
    uomId: uuid('uom_id'),
    unitCostMinor: bigint('unit_cost_minor', { mode: 'number' }).notNull().default(0),
    totalCostMinor: bigint('total_cost_minor', { mode: 'number' }).notNull().default(0),
    currencyCode: text('currency_code').notNull().default('MYR'),
    postedAt: timestamp('posted_at', { withTimezone: true }).notNull().defaultNow(),
    sourceType: text('source_type'),
    sourceId: uuid('source_id'),
    batchNo: text('batch_no'),
    serialNo: text('serial_no'),
    lotNo: text('lot_no'),
    costingMethod: text('costing_method').notNull().default('weighted_average'),
    runningQty: numeric('running_qty', { precision: 20, scale: 6 }),
    runningCostMinor: bigint('running_cost_minor', { mode: 'number' }),
    warehouseZone: text('warehouse_zone'),
    memo: text('memo'),
  },
  (table) => [
    index('stock_mv_org_id_idx').on(table.orgId, table.id),
    index('stock_mv_org_company_idx').on(table.orgId, table.companyId),
    index('stock_mv_item_idx').on(table.orgId, table.siteId, table.itemId),
    index('stock_mv_posted_idx').on(table.orgId, table.companyId, table.postedAt),
    index('stock_mv_source_idx').on(table.orgId, table.sourceType, table.sourceId),
    index('stock_mv_batch_idx').on(table.orgId, table.itemId, table.batchNo),
    check('stock_mv_org_not_empty', sql`org_id <> ''`),
    check('stock_mv_type_valid', sql`movement_type IN ('receipt', 'issue', 'transfer_in', 'transfer_out', 'adjustment', 'return', 'scrap')`),
    check('stock_mv_costing_valid', sql`costing_method IN ('fifo', 'lifo', 'weighted_average', 'specific')`),
    tenantPolicy(table),
  ],
);

export type StockMovement = typeof stockMovements.$inferSelect;
export type NewStockMovement = typeof stockMovements.$inferInsert;
