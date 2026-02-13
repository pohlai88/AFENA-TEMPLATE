// CRUD API handlers for Purchase Receipt
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { purchaseReceipt } from '../db/schema.js';
import { PurchaseReceiptSchema, PurchaseReceiptInsertSchema } from '../types/purchase-receipt.js';

export const ROUTE_PREFIX = '/purchase-receipt';

/**
 * List Purchase Receipt records.
 */
export async function listPurchaseReceipt(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(purchaseReceipt).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Purchase Receipt by ID.
 */
export async function getPurchaseReceipt(db: any, id: string) {
  const rows = await db.select().from(purchaseReceipt).where(eq(purchaseReceipt.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Purchase Receipt.
 */
export async function createPurchaseReceipt(db: any, data: unknown) {
  const parsed = PurchaseReceiptInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(purchaseReceipt).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Purchase Receipt.
 */
export async function updatePurchaseReceipt(db: any, id: string, data: unknown) {
  const parsed = PurchaseReceiptInsertSchema.partial().parse(data);
  await db.update(purchaseReceipt).set({ ...parsed, modified: new Date() }).where(eq(purchaseReceipt.id, id));
  return getPurchaseReceipt(db, id);
}

/**
 * Delete a Purchase Receipt by ID.
 */
export async function deletePurchaseReceipt(db: any, id: string) {
  await db.delete(purchaseReceipt).where(eq(purchaseReceipt.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Purchase Receipt (set docstatus = 1).
 */
export async function submitPurchaseReceipt(db: any, id: string) {
  await db.update(purchaseReceipt).set({ docstatus: 1, modified: new Date() }).where(eq(purchaseReceipt.id, id));
  return getPurchaseReceipt(db, id);
}

/**
 * Cancel a Purchase Receipt (set docstatus = 2).
 */
export async function cancelPurchaseReceipt(db: any, id: string) {
  await db.update(purchaseReceipt).set({ docstatus: 2, modified: new Date() }).where(eq(purchaseReceipt.id, id));
  return getPurchaseReceipt(db, id);
}
