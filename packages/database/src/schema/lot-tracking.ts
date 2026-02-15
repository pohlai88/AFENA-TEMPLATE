import { sql } from 'drizzle-orm';
import { check, date, foreignKey, index, numeric, pgTable, primaryKey, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { baseEntityColumns } from '../helpers/base-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

import { companies } from './companies';

/**
 * Lot/batch/serial tracking — traceability for regulated industries.
 *
 * RULE C-01: Lot tracking is OPERATIONS-scoped (company tracks lots/batches).
 * PRD Phase E #23 + G0.14:
 * - tracking_type: 'lot', 'batch', 'serial'
 * - Links to product + optional stock_movement
 * - Expiry/production dates for food/pharma
 * - Trace graph queryable via standard indexes (no JSON-only)
 * 
 * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.
 */
export const lotTracking = pgTable(
  'lot_tracking',
  {
    ...baseEntityColumns,
    companyId: uuid('company_id').notNull(),
    itemId: uuid('item_id').notNull(),
    trackingType: text('tracking_type').notNull(),
    trackingNo: text('tracking_no').notNull(),
    productionDate: date('production_date'),
    expiryDate: date('expiry_date'),
    qty: numeric('qty', { precision: 20, scale: 6 }),
    uomId: uuid('uom_id'),
    siteId: uuid('site_id'),
    warehouseZone: text('warehouse_zone'),
    supplierId: uuid('supplier_id'),
    supplierBatchNo: text('supplier_batch_no'),
    status: text('status').notNull().default('active'),
    memo: text('memo'),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    foreignKey({
      columns: [table.orgId, table.companyId],
      foreignColumns: [companies.orgId, companies.id],
      name: 'lot_tracking_company_fk',
    }),
    index('lot_track_org_id_idx').on(table.orgId, table.id),
    index('lot_track_item_idx').on(table.orgId, table.itemId),
    index('lot_track_company_idx').on(table.orgId, table.companyId),
    index('lot_track_expiry_idx').on(table.orgId, table.itemId, table.expiryDate),
    uniqueIndex('lot_track_org_product_no_uniq').on(
      table.orgId,
      table.companyId,
      table.itemId,
      table.trackingNo,
    ),
    check('lot_track_org_not_empty', sql`org_id <> ''`),
    check('lot_track_type_valid', sql`tracking_type IN ('lot', 'batch', 'serial')`),
    check('lot_track_status_valid', sql`status IN ('active', 'consumed', 'expired', 'recalled', 'quarantined')`),
    tenantPolicy(table),
  ],
);

export type LotTracking = typeof lotTracking.$inferSelect;
export type NewLotTracking = typeof lotTracking.$inferInsert;
