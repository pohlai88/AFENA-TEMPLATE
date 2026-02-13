// CRUD API handlers for UOM Category
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { uomCategory } from '../db/schema.js';
import { UomCategorySchema, UomCategoryInsertSchema } from '../types/uom-category.js';

export const ROUTE_PREFIX = '/uom-category';

/**
 * List UOM Category records.
 */
export async function listUomCategory(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(uomCategory).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single UOM Category by ID.
 */
export async function getUomCategory(db: any, id: string) {
  const rows = await db.select().from(uomCategory).where(eq(uomCategory.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new UOM Category.
 */
export async function createUomCategory(db: any, data: unknown) {
  const parsed = UomCategoryInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(uomCategory).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing UOM Category.
 */
export async function updateUomCategory(db: any, id: string, data: unknown) {
  const parsed = UomCategoryInsertSchema.partial().parse(data);
  await db.update(uomCategory).set({ ...parsed, modified: new Date() }).where(eq(uomCategory.id, id));
  return getUomCategory(db, id);
}

/**
 * Delete a UOM Category by ID.
 */
export async function deleteUomCategory(db: any, id: string) {
  await db.delete(uomCategory).where(eq(uomCategory.id, id));
  return { deleted: true, id };
}
