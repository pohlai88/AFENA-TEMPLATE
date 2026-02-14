// CRUD API handlers for Purchase Order Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { purchaseOrderItem } from '../db/schema.js';
import { PurchaseOrderItemSchema, PurchaseOrderItemInsertSchema } from '../types/purchase-order-item.js';

export const ROUTE_PREFIX = '/purchase-order-item';

/**
 * List Purchase Order Item records.
 */
export async function listPurchaseOrderItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(purchaseOrderItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Purchase Order Item by ID.
 */
export async function getPurchaseOrderItem(db: any, id: string) {
  const rows = await db.select().from(purchaseOrderItem).where(eq(purchaseOrderItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Purchase Order Item.
 */
export async function createPurchaseOrderItem(db: any, data: unknown) {
  const parsed = PurchaseOrderItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(purchaseOrderItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Purchase Order Item.
 */
export async function updatePurchaseOrderItem(db: any, id: string, data: unknown) {
  const parsed = PurchaseOrderItemInsertSchema.partial().parse(data);
  await db.update(purchaseOrderItem).set({ ...parsed, modified: new Date() }).where(eq(purchaseOrderItem.id, id));
  return getPurchaseOrderItem(db, id);
}

/**
 * Delete a Purchase Order Item by ID.
 */
export async function deletePurchaseOrderItem(db: any, id: string) {
  await db.delete(purchaseOrderItem).where(eq(purchaseOrderItem.id, id));
  return { deleted: true, id };
}
