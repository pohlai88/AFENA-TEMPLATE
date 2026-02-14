// CRUD API handlers for Tax Category
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { taxCategory } from '../db/schema.js';
import { TaxCategorySchema, TaxCategoryInsertSchema } from '../types/tax-category.js';

export const ROUTE_PREFIX = '/tax-category';

/**
 * List Tax Category records.
 */
export async function listTaxCategory(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(taxCategory).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Tax Category by ID.
 */
export async function getTaxCategory(db: any, id: string) {
  const rows = await db.select().from(taxCategory).where(eq(taxCategory.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Tax Category.
 */
export async function createTaxCategory(db: any, data: unknown) {
  const parsed = TaxCategoryInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(taxCategory).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Tax Category.
 */
export async function updateTaxCategory(db: any, id: string, data: unknown) {
  const parsed = TaxCategoryInsertSchema.partial().parse(data);
  await db.update(taxCategory).set({ ...parsed, modified: new Date() }).where(eq(taxCategory.id, id));
  return getTaxCategory(db, id);
}

/**
 * Delete a Tax Category by ID.
 */
export async function deleteTaxCategory(db: any, id: string) {
  await db.delete(taxCategory).where(eq(taxCategory.id, id));
  return { deleted: true, id };
}
