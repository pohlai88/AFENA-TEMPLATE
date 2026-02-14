// CRUD API handlers for Product Bundle Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { productBundleItem } from '../db/schema.js';
import { ProductBundleItemSchema, ProductBundleItemInsertSchema } from '../types/product-bundle-item.js';

export const ROUTE_PREFIX = '/product-bundle-item';

/**
 * List Product Bundle Item records.
 */
export async function listProductBundleItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(productBundleItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Product Bundle Item by ID.
 */
export async function getProductBundleItem(db: any, id: string) {
  const rows = await db.select().from(productBundleItem).where(eq(productBundleItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Product Bundle Item.
 */
export async function createProductBundleItem(db: any, data: unknown) {
  const parsed = ProductBundleItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(productBundleItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Product Bundle Item.
 */
export async function updateProductBundleItem(db: any, id: string, data: unknown) {
  const parsed = ProductBundleItemInsertSchema.partial().parse(data);
  await db.update(productBundleItem).set({ ...parsed, modified: new Date() }).where(eq(productBundleItem.id, id));
  return getProductBundleItem(db, id);
}

/**
 * Delete a Product Bundle Item by ID.
 */
export async function deleteProductBundleItem(db: any, id: string) {
  await db.delete(productBundleItem).where(eq(productBundleItem.id, id));
  return { deleted: true, id };
}
