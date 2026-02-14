// CRUD API handlers for Purchase Taxes and Charges
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { purchaseTaxesAndCharges } from '../db/schema.js';
import { PurchaseTaxesAndChargesSchema, PurchaseTaxesAndChargesInsertSchema } from '../types/purchase-taxes-and-charges.js';

export const ROUTE_PREFIX = '/purchase-taxes-and-charges';

/**
 * List Purchase Taxes and Charges records.
 */
export async function listPurchaseTaxesAndCharges(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(purchaseTaxesAndCharges).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Purchase Taxes and Charges by ID.
 */
export async function getPurchaseTaxesAndCharges(db: any, id: string) {
  const rows = await db.select().from(purchaseTaxesAndCharges).where(eq(purchaseTaxesAndCharges.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Purchase Taxes and Charges.
 */
export async function createPurchaseTaxesAndCharges(db: any, data: unknown) {
  const parsed = PurchaseTaxesAndChargesInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(purchaseTaxesAndCharges).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Purchase Taxes and Charges.
 */
export async function updatePurchaseTaxesAndCharges(db: any, id: string, data: unknown) {
  const parsed = PurchaseTaxesAndChargesInsertSchema.partial().parse(data);
  await db.update(purchaseTaxesAndCharges).set({ ...parsed, modified: new Date() }).where(eq(purchaseTaxesAndCharges.id, id));
  return getPurchaseTaxesAndCharges(db, id);
}

/**
 * Delete a Purchase Taxes and Charges by ID.
 */
export async function deletePurchaseTaxesAndCharges(db: any, id: string) {
  await db.delete(purchaseTaxesAndCharges).where(eq(purchaseTaxesAndCharges.id, id));
  return { deleted: true, id };
}
