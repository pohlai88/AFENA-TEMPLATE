// CRUD API handlers for Purchase Taxes and Charges Template
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { purchaseTaxesAndChargesTemplate } from '../db/schema.js';
import { PurchaseTaxesAndChargesTemplateSchema, PurchaseTaxesAndChargesTemplateInsertSchema } from '../types/purchase-taxes-and-charges-template.js';

export const ROUTE_PREFIX = '/purchase-taxes-and-charges-template';

/**
 * List Purchase Taxes and Charges Template records.
 */
export async function listPurchaseTaxesAndChargesTemplate(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(purchaseTaxesAndChargesTemplate).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Purchase Taxes and Charges Template by ID.
 */
export async function getPurchaseTaxesAndChargesTemplate(db: any, id: string) {
  const rows = await db.select().from(purchaseTaxesAndChargesTemplate).where(eq(purchaseTaxesAndChargesTemplate.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Purchase Taxes and Charges Template.
 */
export async function createPurchaseTaxesAndChargesTemplate(db: any, data: unknown) {
  const parsed = PurchaseTaxesAndChargesTemplateInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(purchaseTaxesAndChargesTemplate).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Purchase Taxes and Charges Template.
 */
export async function updatePurchaseTaxesAndChargesTemplate(db: any, id: string, data: unknown) {
  const parsed = PurchaseTaxesAndChargesTemplateInsertSchema.partial().parse(data);
  await db.update(purchaseTaxesAndChargesTemplate).set({ ...parsed, modified: new Date() }).where(eq(purchaseTaxesAndChargesTemplate.id, id));
  return getPurchaseTaxesAndChargesTemplate(db, id);
}

/**
 * Delete a Purchase Taxes and Charges Template by ID.
 */
export async function deletePurchaseTaxesAndChargesTemplate(db: any, id: string) {
  await db.delete(purchaseTaxesAndChargesTemplate).where(eq(purchaseTaxesAndChargesTemplate.id, id));
  return { deleted: true, id };
}
