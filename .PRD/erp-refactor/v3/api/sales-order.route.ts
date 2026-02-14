// CRUD API handlers for Sales Order
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { salesOrder } from '../db/schema.js';
import { SalesOrderSchema, SalesOrderInsertSchema } from '../types/sales-order.js';

export const ROUTE_PREFIX = '/sales-order';

/**
 * List Sales Order records.
 */
export async function listSalesOrder(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(salesOrder).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Sales Order by ID.
 */
export async function getSalesOrder(db: any, id: string) {
  const rows = await db.select().from(salesOrder).where(eq(salesOrder.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Sales Order.
 */
export async function createSalesOrder(db: any, data: unknown) {
  const parsed = SalesOrderInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(salesOrder).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Sales Order.
 */
export async function updateSalesOrder(db: any, id: string, data: unknown) {
  const parsed = SalesOrderInsertSchema.partial().parse(data);
  await db.update(salesOrder).set({ ...parsed, modified: new Date() }).where(eq(salesOrder.id, id));
  return getSalesOrder(db, id);
}

/**
 * Delete a Sales Order by ID.
 */
export async function deleteSalesOrder(db: any, id: string) {
  await db.delete(salesOrder).where(eq(salesOrder.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Sales Order (set docstatus = 1).
 */
export async function submitSalesOrder(db: any, id: string) {
  await db.update(salesOrder).set({ docstatus: 1, modified: new Date() }).where(eq(salesOrder.id, id));
  return getSalesOrder(db, id);
}

/**
 * Cancel a Sales Order (set docstatus = 2).
 */
export async function cancelSalesOrder(db: any, id: string) {
  await db.update(salesOrder).set({ docstatus: 2, modified: new Date() }).where(eq(salesOrder.id, id));
  return getSalesOrder(db, id);
}
