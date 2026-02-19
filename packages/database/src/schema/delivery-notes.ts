import { sql } from 'drizzle-orm';
import { authenticatedRole, crudPolicy } from 'drizzle-orm/neon';
import {
    check,
    index,
    jsonb,
    pgTable,
    text,
    timestamp,
    uuid
} from 'drizzle-orm/pg-core';
import { baseEntityColumns, tenantPk } from '../helpers/base-entity';

/**
 * Delivery Notes — purchasing receipt documents.
 * Represents goods received against a purchase order.
 */
export const deliveryNotes = pgTable(
  'delivery_notes',
  {
    ...baseEntityColumns,
    docNumber: text('doc_number').notNull(),
    supplierId: uuid('supplier_id'),
    purchaseOrderId: uuid('purchase_order_id'),
    warehouseId: uuid('warehouse_id'),
    siteId: uuid('site_id'),
    receivedAt: timestamp('received_at', { withTimezone: true }),
    notes: text('notes'),
    docStatus: text('doc_status').notNull().default('draft'),
    currency: text('currency').notNull().default('USD'),
    exchangeRate: text('exchange_rate').notNull().default('1'),
    metadata: jsonb('metadata'),
  },
  (table) => [
    tenantPk(table),
    index('delivery_notes_org_status_idx').on(table.orgId, table.docStatus, table.createdAt),
    index('delivery_notes_supplier_idx').on(table.orgId, table.supplierId),
    index('delivery_notes_po_idx').on(table.orgId, table.purchaseOrderId),
    check('delivery_notes_org_not_empty', sql`org_id <> ''`),
    crudPolicy({
      role: authenticatedRole,
      read: sql`(select auth.org_id() = ${table.orgId})`,
      modify: sql`(select auth.org_id() = ${table.orgId})`,
    }),
  ],
);

export type DeliveryNote = typeof deliveryNotes.$inferSelect;
export type NewDeliveryNote = typeof deliveryNotes.$inferInsert;
