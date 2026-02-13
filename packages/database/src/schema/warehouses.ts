import { sql } from 'drizzle-orm';
import { boolean, check, index, pgTable, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { baseEntityColumns } from '../helpers/base-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Warehouses — stock storage locations scoped to company.
 *
 * Transactional Spine Migration 0031: Master Data.
 * - company_id NOT NULL: warehouse always belongs to a legal entity
 * - warehouse_type: store/transit/scrap/wip/finished/returns (consignment added later)
 * - Tree structure via parent_warehouse_id + is_group
 */
export const warehouses = pgTable(
  'warehouses',
  {
    ...baseEntityColumns,
    companyId: uuid('company_id').notNull(),
    siteId: uuid('site_id'),
    code: text('code').notNull(),
    name: text('name').notNull(),
    warehouseType: text('warehouse_type').notNull().default('store'),
    parentWarehouseId: uuid('parent_warehouse_id'),
    isGroup: boolean('is_group').notNull().default(false),
  },
  (table) => [
    uniqueIndex('warehouses_org_code_uniq').on(table.orgId, table.code),
    index('warehouses_org_company_idx').on(table.orgId, table.companyId),
    index('warehouses_org_parent_idx').on(table.orgId, table.parentWarehouseId),
    check('warehouses_org_not_empty', sql`org_id <> ''`),
    check('warehouses_code_not_empty', sql`code <> ''`),
    check(
      'warehouses_type_valid',
      sql`warehouse_type IN ('store', 'transit', 'scrap', 'wip', 'finished', 'returns')`,
    ),
    tenantPolicy(table),
  ],
);

export type Warehouse = typeof warehouses.$inferSelect;
export type NewWarehouse = typeof warehouses.$inferInsert;
