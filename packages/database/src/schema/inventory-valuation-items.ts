import { sql } from 'drizzle-orm';
import { check, index, pgTable, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { currencyCodeStrict, moneyMinor, qty } from '../helpers/field-types';
import { erpIndexes } from '../helpers/standard-indexes';

/**
 * Inventory Valuation Items — IAS 2
 *
 * Records periodic inventory valuation snapshots per item.
 * Natural key: (org_id, company_id, item_id, period_key).
 *
 * Shared-kernel table target: `inventory.inventory_valuations`
 * Write policy: intent-only (inventory.costing, inventory.nrv.adjust).
 */
export const inventoryValuationItems = pgTable(
  'inventory_valuation_items',
  {
    ...erpEntityColumns,
    itemId: uuid('item_id').notNull(),
    periodKey: text('period_key').notNull(),
    costMethod: text('cost_method').notNull(),
    currencyCode: currencyCodeStrict('currency_code'),
    totalCostMinor: moneyMinor('total_cost_minor'),
    unitCostMinor: moneyMinor('unit_cost_minor'),
    nrvMinor: moneyMinor('nrv_minor'),
    writedownMinor: moneyMinor('writedown_minor'),
    quantityOnHand: qty('quantity_on_hand'),
  },
  (t) => [
    ...erpIndexes('inventory_valuation_items', t),
    uniqueIndex('uq__inv_val_items__org_company_item_period').on(
      t.orgId,
      t.companyId,
      t.itemId,
      t.periodKey,
    ),
    index('inventory_valuation_items_org_company_item_idx').on(t.orgId, t.companyId, t.itemId),
    index('inventory_valuation_items_org_company_period_idx').on(t.orgId, t.companyId, t.periodKey),
    check(
      'inventory_valuation_items_valid_cost_method',
      sql`cost_method IN ('fifo', 'weighted-average', 'specific-identification')`,
    ),
    check('inventory_valuation_items_period_format', sql`period_key ~ '^[0-9]{4}-P[0-9]{1,2}$'`),
  ],
);

export type InventoryValuationItemRow = typeof inventoryValuationItems.$inferSelect;
export type NewInventoryValuationItemRow = typeof inventoryValuationItems.$inferInsert;
