// CRUD API handlers for Product Bundle
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { productBundle } from '../db/schema.js';
import { ProductBundleSchema, ProductBundleInsertSchema } from '../types/product-bundle.js';

export const ROUTE_PREFIX = '/product-bundle';

/**
 * List Product Bundle records.
 */
export async function listProductBundle(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(productBundle).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Product Bundle by ID.
 */
export async function getProductBundle(db: any, id: string) {
  const rows = await db.select().from(productBundle).where(eq(productBundle.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Product Bundle.
 */
export async function createProductBundle(db: any, data: unknown) {
  const parsed = ProductBundleInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(productBundle).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Product Bundle.
 */
export async function updateProductBundle(db: any, id: string, data: unknown) {
  const parsed = ProductBundleInsertSchema.partial().parse(data);
  await db.update(productBundle).set({ ...parsed, modified: new Date() }).where(eq(productBundle.id, id));
  return getProductBundle(db, id);
}

/**
 * Delete a Product Bundle by ID.
 */
export async function deleteProductBundle(db: any, id: string) {
  await db.delete(productBundle).where(eq(productBundle.id, id));
  return { deleted: true, id };
}
