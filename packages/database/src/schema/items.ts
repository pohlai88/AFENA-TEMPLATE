import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  index,
  integer,
  numeric,
  pgTable,
  text,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

import { baseEntityColumns } from '../helpers/base-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Items — products, services, consumables, raw materials.
 *
 * Transactional Spine Migration 0031: Master Data.
 * - item_type: product/service/consumable/raw_material
 * - valuation_method: fifo/weighted_average (for stock items)
 * - UOM fields: default, inventory, purchase, sales
 * - Flags: is_stock_item, is_purchase_item, is_sales_item, is_fixed_asset
 * - Reorder/safety stock planning fields
 * - Default account/warehouse/cost centre for auto-fill
 */
export const items = pgTable(
  'items',
  {
    ...baseEntityColumns,
    code: text('code').notNull(),
    name: text('name').notNull(),
    itemGroupId: uuid('item_group_id'),
    itemType: text('item_type').notNull().default('product'),
    // UOM references
    defaultUomId: uuid('default_uom_id'),
    inventoryUomId: uuid('inventory_uom_id'),
    purchaseUomId: uuid('purchase_uom_id'),
    salesUomId: uuid('sales_uom_id'),
    // Inventory flags
    isStockItem: boolean('is_stock_item').notNull().default(true),
    isPurchaseItem: boolean('is_purchase_item').notNull().default(true),
    isSalesItem: boolean('is_sales_item').notNull().default(true),
    isFixedAsset: boolean('is_fixed_asset').notNull().default(false),
    // Valuation
    valuationMethod: text('valuation_method').notNull().default('weighted_average'),
    defaultWarehouseId: uuid('default_warehouse_id'),
    // Batch/serial
    hasBatchNo: boolean('has_batch_no').notNull().default(false),
    hasSerialNo: boolean('has_serial_no').notNull().default(false),
    shelfLifeDays: integer('shelf_life_days'),
    // Weight
    weightPerUnit: numeric('weight_per_unit', { precision: 10, scale: 4 }),
    weightUomId: uuid('weight_uom_id'),
    // Classification
    hsnCode: text('hsn_code'),
    barcode: text('barcode'),
    description: text('description'),
    // Planning
    minOrderQty: numeric('min_order_qty', { precision: 20, scale: 6 }),
    reorderLevel: numeric('reorder_level', { precision: 20, scale: 6 }),
    reorderQty: numeric('reorder_qty', { precision: 20, scale: 6 }),
    leadTimeDays: integer('lead_time_days'),
    safetyStock: numeric('safety_stock', { precision: 20, scale: 6 }),
    // Default accounts
    defaultExpenseAccountId: uuid('default_expense_account_id'),
    defaultIncomeAccountId: uuid('default_income_account_id'),
    defaultCostCenterId: uuid('default_cost_center_id'),
  },
  (table) => [
    uniqueIndex('items_org_code_uniq').on(table.orgId, table.code),
    index('items_org_group_idx').on(table.orgId, table.itemGroupId),
    index('items_org_type_idx').on(table.orgId, table.itemType),
    index('items_org_stock_idx')
      .on(table.orgId, table.isStockItem)
      .where(sql`is_stock_item = true`),
    check('items_org_not_empty', sql`org_id <> ''`),
    check('items_code_not_empty', sql`code <> ''`),
    check(
      'items_type_valid',
      sql`item_type IN ('product', 'service', 'consumable', 'raw_material')`,
    ),
    check(
      'items_valuation_valid',
      sql`valuation_method IN ('fifo', 'weighted_average')`,
    ),
    tenantPolicy(table),
  ],
);

export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;
