// CRUD API handlers for Tax Withholding Category
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { taxWithholdingCategory } from '../db/schema.js';
import { TaxWithholdingCategorySchema, TaxWithholdingCategoryInsertSchema } from '../types/tax-withholding-category.js';

export const ROUTE_PREFIX = '/tax-withholding-category';

/**
 * List Tax Withholding Category records.
 */
export async function listTaxWithholdingCategory(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(taxWithholdingCategory).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Tax Withholding Category by ID.
 */
export async function getTaxWithholdingCategory(db: any, id: string) {
  const rows = await db.select().from(taxWithholdingCategory).where(eq(taxWithholdingCategory.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Tax Withholding Category.
 */
export async function createTaxWithholdingCategory(db: any, data: unknown) {
  const parsed = TaxWithholdingCategoryInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(taxWithholdingCategory).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Tax Withholding Category.
 */
export async function updateTaxWithholdingCategory(db: any, id: string, data: unknown) {
  const parsed = TaxWithholdingCategoryInsertSchema.partial().parse(data);
  await db.update(taxWithholdingCategory).set({ ...parsed, modified: new Date() }).where(eq(taxWithholdingCategory.id, id));
  return getTaxWithholdingCategory(db, id);
}

/**
 * Delete a Tax Withholding Category by ID.
 */
export async function deleteTaxWithholdingCategory(db: any, id: string) {
  await db.delete(taxWithholdingCategory).where(eq(taxWithholdingCategory.id, id));
  return { deleted: true, id };
}
