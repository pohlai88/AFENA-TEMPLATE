import { sql } from 'drizzle-orm';
import { authenticatedRole, crudPolicy } from 'drizzle-orm/neon';
import {
    check,
    index,
    integer,
    pgTable,
    text,
    uuid,
} from 'drizzle-orm/pg-core';
import { tenantPk } from '../helpers/base-entity';

/**
 * Delivery Note Lines — individual received items within a delivery note.
 */
export const deliveryNoteLines = pgTable(
  'delivery_note_lines',
  {
    id: uuid('id').defaultRandom().notNull(),
    orgId: uuid('org_id')
      .notNull()
      .default(sql`(auth.org_id()::uuid)`),
    deliveryNoteId: uuid('delivery_note_id').notNull(),
    lineNumber: integer('line_number').notNull().default(1),
    productId: uuid('product_id'),
    description: text('description'),
    qty: text('qty').notNull().default('0'),
    uom: text('uom'),
    unitCost: text('unit_cost').notNull().default('0'),
    totalCost: text('total_cost').notNull().default('0'),
    purchaseOrderLineId: uuid('purchase_order_line_id'),
    notes: text('notes'),
  },
  (table) => [
    tenantPk(table),
    index('delivery_note_lines_note_idx').on(table.orgId, table.deliveryNoteId, table.lineNumber),
    check('delivery_note_lines_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    crudPolicy({
      role: authenticatedRole,
      read: sql`(select auth.org_id()::uuid = ${table.orgId})`,
      modify: sql`(select auth.org_id()::uuid = ${table.orgId})`,
    }),
  ],
);

export type DeliveryNoteLine = typeof deliveryNoteLines.$inferSelect;
export type NewDeliveryNoteLine = typeof deliveryNoteLines.$inferInsert;
