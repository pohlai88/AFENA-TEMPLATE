// CRUD API handlers for Sales Taxes and Charges
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { salesTaxesAndCharges } from '../db/schema.js';
import { SalesTaxesAndChargesSchema, SalesTaxesAndChargesInsertSchema } from '../types/sales-taxes-and-charges.js';

export const ROUTE_PREFIX = '/sales-taxes-and-charges';

/**
 * List Sales Taxes and Charges records.
 */
export async function listSalesTaxesAndCharges(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(salesTaxesAndCharges).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Sales Taxes and Charges by ID.
 */
export async function getSalesTaxesAndCharges(db: any, id: string) {
  const rows = await db.select().from(salesTaxesAndCharges).where(eq(salesTaxesAndCharges.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Sales Taxes and Charges.
 */
export async function createSalesTaxesAndCharges(db: any, data: unknown) {
  const parsed = SalesTaxesAndChargesInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(salesTaxesAndCharges).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Sales Taxes and Charges.
 */
export async function updateSalesTaxesAndCharges(db: any, id: string, data: unknown) {
  const parsed = SalesTaxesAndChargesInsertSchema.partial().parse(data);
  await db.update(salesTaxesAndCharges).set({ ...parsed, modified: new Date() }).where(eq(salesTaxesAndCharges.id, id));
  return getSalesTaxesAndCharges(db, id);
}

/**
 * Delete a Sales Taxes and Charges by ID.
 */
export async function deleteSalesTaxesAndCharges(db: any, id: string) {
  await db.delete(salesTaxesAndCharges).where(eq(salesTaxesAndCharges.id, id));
  return { deleted: true, id };
}
