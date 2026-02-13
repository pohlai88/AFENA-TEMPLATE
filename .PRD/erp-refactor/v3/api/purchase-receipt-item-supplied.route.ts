// CRUD API handlers for Purchase Receipt Item Supplied
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { purchaseReceiptItemSupplied } from '../db/schema.js';
import { PurchaseReceiptItemSuppliedSchema, PurchaseReceiptItemSuppliedInsertSchema } from '../types/purchase-receipt-item-supplied.js';

export const ROUTE_PREFIX = '/purchase-receipt-item-supplied';

/**
 * List Purchase Receipt Item Supplied records.
 */
export async function listPurchaseReceiptItemSupplied(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(purchaseReceiptItemSupplied).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Purchase Receipt Item Supplied by ID.
 */
export async function getPurchaseReceiptItemSupplied(db: any, id: string) {
  const rows = await db.select().from(purchaseReceiptItemSupplied).where(eq(purchaseReceiptItemSupplied.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Purchase Receipt Item Supplied.
 */
export async function createPurchaseReceiptItemSupplied(db: any, data: unknown) {
  const parsed = PurchaseReceiptItemSuppliedInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(purchaseReceiptItemSupplied).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Purchase Receipt Item Supplied.
 */
export async function updatePurchaseReceiptItemSupplied(db: any, id: string, data: unknown) {
  const parsed = PurchaseReceiptItemSuppliedInsertSchema.partial().parse(data);
  await db.update(purchaseReceiptItemSupplied).set({ ...parsed, modified: new Date() }).where(eq(purchaseReceiptItemSupplied.id, id));
  return getPurchaseReceiptItemSupplied(db, id);
}

/**
 * Delete a Purchase Receipt Item Supplied by ID.
 */
export async function deletePurchaseReceiptItemSupplied(db: any, id: string) {
  await db.delete(purchaseReceiptItemSupplied).where(eq(purchaseReceiptItemSupplied.id, id));
  return { deleted: true, id };
}
