// CRUD API handlers for Brand
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { brand } from '../db/schema.js';
import { BrandSchema, BrandInsertSchema } from '../types/brand.js';

export const ROUTE_PREFIX = '/brand';

/**
 * List Brand records.
 */
export async function listBrand(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(brand).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Brand by ID.
 */
export async function getBrand(db: any, id: string) {
  const rows = await db.select().from(brand).where(eq(brand.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Brand.
 */
export async function createBrand(db: any, data: unknown) {
  const parsed = BrandInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(brand).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Brand.
 */
export async function updateBrand(db: any, id: string, data: unknown) {
  const parsed = BrandInsertSchema.partial().parse(data);
  await db.update(brand).set({ ...parsed, modified: new Date() }).where(eq(brand.id, id));
  return getBrand(db, id);
}

/**
 * Delete a Brand by ID.
 */
export async function deleteBrand(db: any, id: string) {
  await db.delete(brand).where(eq(brand.id, id));
  return { deleted: true, id };
}
