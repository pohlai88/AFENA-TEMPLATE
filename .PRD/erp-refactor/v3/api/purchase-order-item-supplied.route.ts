// CRUD API handlers for Purchase Order Item Supplied
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { purchaseOrderItemSupplied } from '../db/schema.js';
import { PurchaseOrderItemSuppliedSchema, PurchaseOrderItemSuppliedInsertSchema } from '../types/purchase-order-item-supplied.js';

export const ROUTE_PREFIX = '/purchase-order-item-supplied';

/**
 * List Purchase Order Item Supplied records.
 */
export async function listPurchaseOrderItemSupplied(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(purchaseOrderItemSupplied).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Purchase Order Item Supplied by ID.
 */
export async function getPurchaseOrderItemSupplied(db: any, id: string) {
  const rows = await db.select().from(purchaseOrderItemSupplied).where(eq(purchaseOrderItemSupplied.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Purchase Order Item Supplied.
 */
export async function createPurchaseOrderItemSupplied(db: any, data: unknown) {
  const parsed = PurchaseOrderItemSuppliedInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(purchaseOrderItemSupplied).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Purchase Order Item Supplied.
 */
export async function updatePurchaseOrderItemSupplied(db: any, id: string, data: unknown) {
  const parsed = PurchaseOrderItemSuppliedInsertSchema.partial().parse(data);
  await db.update(purchaseOrderItemSupplied).set({ ...parsed, modified: new Date() }).where(eq(purchaseOrderItemSupplied.id, id));
  return getPurchaseOrderItemSupplied(db, id);
}

/**
 * Delete a Purchase Order Item Supplied by ID.
 */
export async function deletePurchaseOrderItemSupplied(db: any, id: string) {
  await db.delete(purchaseOrderItemSupplied).where(eq(purchaseOrderItemSupplied.id, id));
  return { deleted: true, id };
}
