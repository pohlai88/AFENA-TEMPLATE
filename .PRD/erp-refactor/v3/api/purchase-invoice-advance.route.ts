// CRUD API handlers for Purchase Invoice Advance
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { purchaseInvoiceAdvance } from '../db/schema.js';
import { PurchaseInvoiceAdvanceSchema, PurchaseInvoiceAdvanceInsertSchema } from '../types/purchase-invoice-advance.js';

export const ROUTE_PREFIX = '/purchase-invoice-advance';

/**
 * List Purchase Invoice Advance records.
 */
export async function listPurchaseInvoiceAdvance(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(purchaseInvoiceAdvance).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Purchase Invoice Advance by ID.
 */
export async function getPurchaseInvoiceAdvance(db: any, id: string) {
  const rows = await db.select().from(purchaseInvoiceAdvance).where(eq(purchaseInvoiceAdvance.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Purchase Invoice Advance.
 */
export async function createPurchaseInvoiceAdvance(db: any, data: unknown) {
  const parsed = PurchaseInvoiceAdvanceInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(purchaseInvoiceAdvance).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Purchase Invoice Advance.
 */
export async function updatePurchaseInvoiceAdvance(db: any, id: string, data: unknown) {
  const parsed = PurchaseInvoiceAdvanceInsertSchema.partial().parse(data);
  await db.update(purchaseInvoiceAdvance).set({ ...parsed, modified: new Date() }).where(eq(purchaseInvoiceAdvance.id, id));
  return getPurchaseInvoiceAdvance(db, id);
}

/**
 * Delete a Purchase Invoice Advance by ID.
 */
export async function deletePurchaseInvoiceAdvance(db: any, id: string) {
  await db.delete(purchaseInvoiceAdvance).where(eq(purchaseInvoiceAdvance.id, id));
  return { deleted: true, id };
}
