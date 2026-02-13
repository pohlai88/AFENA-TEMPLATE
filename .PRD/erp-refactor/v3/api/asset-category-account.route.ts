// CRUD API handlers for Asset Category Account
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { assetCategoryAccount } from '../db/schema.js';
import { AssetCategoryAccountSchema, AssetCategoryAccountInsertSchema } from '../types/asset-category-account.js';

export const ROUTE_PREFIX = '/asset-category-account';

/**
 * List Asset Category Account records.
 */
export async function listAssetCategoryAccount(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(assetCategoryAccount).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Asset Category Account by ID.
 */
export async function getAssetCategoryAccount(db: any, id: string) {
  const rows = await db.select().from(assetCategoryAccount).where(eq(assetCategoryAccount.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Asset Category Account.
 */
export async function createAssetCategoryAccount(db: any, data: unknown) {
  const parsed = AssetCategoryAccountInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(assetCategoryAccount).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Asset Category Account.
 */
export async function updateAssetCategoryAccount(db: any, id: string, data: unknown) {
  const parsed = AssetCategoryAccountInsertSchema.partial().parse(data);
  await db.update(assetCategoryAccount).set({ ...parsed, modified: new Date() }).where(eq(assetCategoryAccount.id, id));
  return getAssetCategoryAccount(db, id);
}

/**
 * Delete a Asset Category Account by ID.
 */
export async function deleteAssetCategoryAccount(db: any, id: string) {
  await db.delete(assetCategoryAccount).where(eq(assetCategoryAccount.id, id));
  return { deleted: true, id };
}
