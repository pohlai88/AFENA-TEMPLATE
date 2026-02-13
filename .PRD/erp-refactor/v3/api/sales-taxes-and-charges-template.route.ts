// CRUD API handlers for Sales Taxes and Charges Template
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { salesTaxesAndChargesTemplate } from '../db/schema.js';
import { SalesTaxesAndChargesTemplateSchema, SalesTaxesAndChargesTemplateInsertSchema } from '../types/sales-taxes-and-charges-template.js';

export const ROUTE_PREFIX = '/sales-taxes-and-charges-template';

/**
 * List Sales Taxes and Charges Template records.
 */
export async function listSalesTaxesAndChargesTemplate(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(salesTaxesAndChargesTemplate).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Sales Taxes and Charges Template by ID.
 */
export async function getSalesTaxesAndChargesTemplate(db: any, id: string) {
  const rows = await db.select().from(salesTaxesAndChargesTemplate).where(eq(salesTaxesAndChargesTemplate.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Sales Taxes and Charges Template.
 */
export async function createSalesTaxesAndChargesTemplate(db: any, data: unknown) {
  const parsed = SalesTaxesAndChargesTemplateInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(salesTaxesAndChargesTemplate).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Sales Taxes and Charges Template.
 */
export async function updateSalesTaxesAndChargesTemplate(db: any, id: string, data: unknown) {
  const parsed = SalesTaxesAndChargesTemplateInsertSchema.partial().parse(data);
  await db.update(salesTaxesAndChargesTemplate).set({ ...parsed, modified: new Date() }).where(eq(salesTaxesAndChargesTemplate.id, id));
  return getSalesTaxesAndChargesTemplate(db, id);
}

/**
 * Delete a Sales Taxes and Charges Template by ID.
 */
export async function deleteSalesTaxesAndChargesTemplate(db: any, id: string) {
  await db.delete(salesTaxesAndChargesTemplate).where(eq(salesTaxesAndChargesTemplate.id, id));
  return { deleted: true, id };
}
