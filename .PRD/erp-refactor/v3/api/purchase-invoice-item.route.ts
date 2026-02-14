// CRUD API handlers for Purchase Invoice Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { purchaseInvoiceItem } from '../db/schema.js';
import { PurchaseInvoiceItemSchema, PurchaseInvoiceItemInsertSchema } from '../types/purchase-invoice-item.js';

export const ROUTE_PREFIX = '/purchase-invoice-item';

/**
 * List Purchase Invoice Item records.
 */
export async function listPurchaseInvoiceItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(purchaseInvoiceItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Purchase Invoice Item by ID.
 */
export async function getPurchaseInvoiceItem(db: any, id: string) {
  const rows = await db.select().from(purchaseInvoiceItem).where(eq(purchaseInvoiceItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Purchase Invoice Item.
 */
export async function createPurchaseInvoiceItem(db: any, data: unknown) {
  const parsed = PurchaseInvoiceItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(purchaseInvoiceItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Purchase Invoice Item.
 */
export async function updatePurchaseInvoiceItem(db: any, id: string, data: unknown) {
  const parsed = PurchaseInvoiceItemInsertSchema.partial().parse(data);
  await db.update(purchaseInvoiceItem).set({ ...parsed, modified: new Date() }).where(eq(purchaseInvoiceItem.id, id));
  return getPurchaseInvoiceItem(db, id);
}

/**
 * Delete a Purchase Invoice Item by ID.
 */
export async function deletePurchaseInvoiceItem(db: any, id: string) {
  await db.delete(purchaseInvoiceItem).where(eq(purchaseInvoiceItem.id, id));
  return { deleted: true, id };
}
