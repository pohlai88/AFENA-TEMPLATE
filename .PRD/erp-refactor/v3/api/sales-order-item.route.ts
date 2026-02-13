// CRUD API handlers for Sales Order Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { salesOrderItem } from '../db/schema.js';
import { SalesOrderItemSchema, SalesOrderItemInsertSchema } from '../types/sales-order-item.js';

export const ROUTE_PREFIX = '/sales-order-item';

/**
 * List Sales Order Item records.
 */
export async function listSalesOrderItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(salesOrderItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Sales Order Item by ID.
 */
export async function getSalesOrderItem(db: any, id: string) {
  const rows = await db.select().from(salesOrderItem).where(eq(salesOrderItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Sales Order Item.
 */
export async function createSalesOrderItem(db: any, data: unknown) {
  const parsed = SalesOrderItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(salesOrderItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Sales Order Item.
 */
export async function updateSalesOrderItem(db: any, id: string, data: unknown) {
  const parsed = SalesOrderItemInsertSchema.partial().parse(data);
  await db.update(salesOrderItem).set({ ...parsed, modified: new Date() }).where(eq(salesOrderItem.id, id));
  return getSalesOrderItem(db, id);
}

/**
 * Delete a Sales Order Item by ID.
 */
export async function deleteSalesOrderItem(db: any, id: string) {
  await db.delete(salesOrderItem).where(eq(salesOrderItem.id, id));
  return { deleted: true, id };
}
