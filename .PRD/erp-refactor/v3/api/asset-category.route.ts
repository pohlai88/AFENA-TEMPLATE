// CRUD API handlers for Asset Category
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { assetCategory } from '../db/schema.js';
import { AssetCategorySchema, AssetCategoryInsertSchema } from '../types/asset-category.js';

export const ROUTE_PREFIX = '/asset-category';

/**
 * List Asset Category records.
 */
export async function listAssetCategory(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(assetCategory).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Asset Category by ID.
 */
export async function getAssetCategory(db: any, id: string) {
  const rows = await db.select().from(assetCategory).where(eq(assetCategory.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Asset Category.
 */
export async function createAssetCategory(db: any, data: unknown) {
  const parsed = AssetCategoryInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(assetCategory).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Asset Category.
 */
export async function updateAssetCategory(db: any, id: string, data: unknown) {
  const parsed = AssetCategoryInsertSchema.partial().parse(data);
  await db.update(assetCategory).set({ ...parsed, modified: new Date() }).where(eq(assetCategory.id, id));
  return getAssetCategory(db, id);
}

/**
 * Delete a Asset Category by ID.
 */
export async function deleteAssetCategory(db: any, id: string) {
  await db.delete(assetCategory).where(eq(assetCategory.id, id));
  return { deleted: true, id };
}
