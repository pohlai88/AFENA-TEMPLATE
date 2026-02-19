import { sql } from 'drizzle-orm';
import { check, index, jsonb, pgTable, text } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const warehouses = pgTable(
  'warehouses',
  {
    ...erpEntityColumns,
    code: text('code').notNull(),
    name: text('name').notNull(),
    type: text('type').notNull().default('standard'),
    address: jsonb('address'),
    capacity: text('capacity'),
    isActive: text('is_active').notNull().default('true'),
  },
  (table) => [
    index('warehouses_org_id_idx').on(table.orgId, table.id),
    index('warehouses_org_code_idx').on(table.orgId, table.code),
    index('warehouses_org_created_idx').on(table.orgId, table.createdAt),
    check('warehouses_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type Warehouse = typeof warehouses.$inferSelect;
export type NewWarehouse = typeof warehouses.$inferInsert;
