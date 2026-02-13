// CRUD API handlers for Purchase Order
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { purchaseOrder } from '../db/schema.js';
import { PurchaseOrderSchema, PurchaseOrderInsertSchema } from '../types/purchase-order.js';

export const ROUTE_PREFIX = '/purchase-order';

/**
 * List Purchase Order records.
 */
export async function listPurchaseOrder(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(purchaseOrder).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Purchase Order by ID.
 */
export async function getPurchaseOrder(db: any, id: string) {
  const rows = await db.select().from(purchaseOrder).where(eq(purchaseOrder.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Purchase Order.
 */
export async function createPurchaseOrder(db: any, data: unknown) {
  const parsed = PurchaseOrderInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(purchaseOrder).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Purchase Order.
 */
export async function updatePurchaseOrder(db: any, id: string, data: unknown) {
  const parsed = PurchaseOrderInsertSchema.partial().parse(data);
  await db.update(purchaseOrder).set({ ...parsed, modified: new Date() }).where(eq(purchaseOrder.id, id));
  return getPurchaseOrder(db, id);
}

/**
 * Delete a Purchase Order by ID.
 */
export async function deletePurchaseOrder(db: any, id: string) {
  await db.delete(purchaseOrder).where(eq(purchaseOrder.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Purchase Order (set docstatus = 1).
 */
export async function submitPurchaseOrder(db: any, id: string) {
  await db.update(purchaseOrder).set({ docstatus: 1, modified: new Date() }).where(eq(purchaseOrder.id, id));
  return getPurchaseOrder(db, id);
}

/**
 * Cancel a Purchase Order (set docstatus = 2).
 */
export async function cancelPurchaseOrder(db: any, id: string) {
  await db.update(purchaseOrder).set({ docstatus: 2, modified: new Date() }).where(eq(purchaseOrder.id, id));
  return getPurchaseOrder(db, id);
}
