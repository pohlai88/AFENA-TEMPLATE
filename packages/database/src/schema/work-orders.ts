import { sql } from 'drizzle-orm';
import { bigint, check, index, numeric, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { docEntityColumns } from '../helpers/doc-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Work orders — manufacturing execution documents.
 *
 * PRD Phase E #19 + G0.21:
 * - Links to BOM for material requirements
 * - WIP posts to GL and stock via wip_movements
 * - docEntity lifecycle: draft → submitted → active → completed → cancelled
 */
export const workOrders = pgTable(
  'work_orders',
  {
    ...docEntityColumns,
    workOrderNo: text('work_order_no'),
    bomId: uuid('bom_id').notNull(),
    productId: uuid('product_id').notNull(),
    plannedQty: numeric('planned_qty', { precision: 20, scale: 6 }).notNull(),
    completedQty: numeric('completed_qty', { precision: 20, scale: 6 }).notNull().default('0'),
    scrapQty: numeric('scrap_qty', { precision: 20, scale: 6 }).notNull().default('0'),
    uomId: uuid('uom_id'),
    plannedStart: timestamp('planned_start', { withTimezone: true }),
    plannedEnd: timestamp('planned_end', { withTimezone: true }),
    actualStart: timestamp('actual_start', { withTimezone: true }),
    actualEnd: timestamp('actual_end', { withTimezone: true }),
    wipAccountId: uuid('wip_account_id'),
    totalCostMinor: bigint('total_cost_minor', { mode: 'number' }).notNull().default(0),
    currencyCode: text('currency_code').notNull().default('MYR'),
    memo: text('memo'),
  },
  (table) => [
    index('work_orders_org_id_idx').on(table.orgId, table.id),
    index('work_orders_org_company_idx').on(table.orgId, table.companyId),
    index('work_orders_product_idx').on(table.orgId, table.productId),
    index('work_orders_bom_idx').on(table.orgId, table.bomId),
    check('work_orders_org_not_empty', sql`org_id <> ''`),
    check('work_orders_qty_positive', sql`planned_qty > 0`),
    tenantPolicy(table),
  ],
);

export type WorkOrder = typeof workOrders.$inferSelect;
export type NewWorkOrder = typeof workOrders.$inferInsert;
