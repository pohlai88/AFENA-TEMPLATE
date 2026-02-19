import { sql } from 'drizzle-orm';
import { check, date, index, jsonb, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { docStatusEnum } from '../helpers/doc-status';
import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const inventoryTransfers = pgTable(
  'inventory_transfers',
  {
    ...erpEntityColumns,
    docStatus: docStatusEnum('doc_status').notNull().default('draft'),
    docNo: text('doc_no'),
    transferNumber: text('transfer_number'),
    fromWarehouse: uuid('from_warehouse').notNull(),
    toWarehouse: uuid('to_warehouse').notNull(),
    transferDate: date('transfer_date'),
    transferLines: jsonb('transfer_lines').notNull().default(sql`'[]'::jsonb`),
  },
  (table) => [
    tenantPk(table),
    index('inventory_transfers_org_id_idx').on(table.orgId, table.id),
    index('inventory_transfers_org_created_idx').on(table.orgId, table.createdAt),
    check('inventory_transfers_org_not_empty', sql`org_id <> ''`),
    check('inventory_transfers_doc_status_valid', sql`doc_status IN ('draft', 'submitted', 'active', 'cancelled')`),
    tenantPolicy(table),
  ],
);

export type InventoryTransfer = typeof inventoryTransfers.$inferSelect;
export type NewInventoryTransfer = typeof inventoryTransfers.$inferInsert;
