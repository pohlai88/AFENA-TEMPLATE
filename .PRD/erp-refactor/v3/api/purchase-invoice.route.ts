// CRUD API handlers for Purchase Invoice
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { purchaseInvoice } from '../db/schema.js';
import { PurchaseInvoiceSchema, PurchaseInvoiceInsertSchema } from '../types/purchase-invoice.js';

export const ROUTE_PREFIX = '/purchase-invoice';

/**
 * List Purchase Invoice records.
 */
export async function listPurchaseInvoice(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(purchaseInvoice).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Purchase Invoice by ID.
 */
export async function getPurchaseInvoice(db: any, id: string) {
  const rows = await db.select().from(purchaseInvoice).where(eq(purchaseInvoice.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Purchase Invoice.
 */
export async function createPurchaseInvoice(db: any, data: unknown) {
  const parsed = PurchaseInvoiceInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(purchaseInvoice).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Purchase Invoice.
 */
export async function updatePurchaseInvoice(db: any, id: string, data: unknown) {
  const parsed = PurchaseInvoiceInsertSchema.partial().parse(data);
  await db.update(purchaseInvoice).set({ ...parsed, modified: new Date() }).where(eq(purchaseInvoice.id, id));
  return getPurchaseInvoice(db, id);
}

/**
 * Delete a Purchase Invoice by ID.
 */
export async function deletePurchaseInvoice(db: any, id: string) {
  await db.delete(purchaseInvoice).where(eq(purchaseInvoice.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Purchase Invoice (set docstatus = 1).
 */
export async function submitPurchaseInvoice(db: any, id: string) {
  await db.update(purchaseInvoice).set({ docstatus: 1, modified: new Date() }).where(eq(purchaseInvoice.id, id));
  return getPurchaseInvoice(db, id);
}

/**
 * Cancel a Purchase Invoice (set docstatus = 2).
 */
export async function cancelPurchaseInvoice(db: any, id: string) {
  await db.update(purchaseInvoice).set({ docstatus: 2, modified: new Date() }).where(eq(purchaseInvoice.id, id));
  return getPurchaseInvoice(db, id);
}
