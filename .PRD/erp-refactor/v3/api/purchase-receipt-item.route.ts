// CRUD API handlers for Purchase Receipt Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { purchaseReceiptItem } from '../db/schema.js';
import { PurchaseReceiptItemSchema, PurchaseReceiptItemInsertSchema } from '../types/purchase-receipt-item.js';

export const ROUTE_PREFIX = '/purchase-receipt-item';

/**
 * List Purchase Receipt Item records.
 */
export async function listPurchaseReceiptItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(purchaseReceiptItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Purchase Receipt Item by ID.
 */
export async function getPurchaseReceiptItem(db: any, id: string) {
  const rows = await db.select().from(purchaseReceiptItem).where(eq(purchaseReceiptItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Purchase Receipt Item.
 */
export async function createPurchaseReceiptItem(db: any, data: unknown) {
  const parsed = PurchaseReceiptItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(purchaseReceiptItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Purchase Receipt Item.
 */
export async function updatePurchaseReceiptItem(db: any, id: string, data: unknown) {
  const parsed = PurchaseReceiptItemInsertSchema.partial().parse(data);
  await db.update(purchaseReceiptItem).set({ ...parsed, modified: new Date() }).where(eq(purchaseReceiptItem.id, id));
  return getPurchaseReceiptItem(db, id);
}

/**
 * Delete a Purchase Receipt Item by ID.
 */
export async function deletePurchaseReceiptItem(db: any, id: string) {
  await db.delete(purchaseReceiptItem).where(eq(purchaseReceiptItem.id, id));
  return { deleted: true, id };
}
