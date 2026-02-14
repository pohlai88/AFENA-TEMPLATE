// CRUD API handlers for Asset Capitalization Asset Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { assetCapitalizationAssetItem } from '../db/schema.js';
import { AssetCapitalizationAssetItemSchema, AssetCapitalizationAssetItemInsertSchema } from '../types/asset-capitalization-asset-item.js';

export const ROUTE_PREFIX = '/asset-capitalization-asset-item';

/**
 * List Asset Capitalization Asset Item records.
 */
export async function listAssetCapitalizationAssetItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(assetCapitalizationAssetItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Asset Capitalization Asset Item by ID.
 */
export async function getAssetCapitalizationAssetItem(db: any, id: string) {
  const rows = await db.select().from(assetCapitalizationAssetItem).where(eq(assetCapitalizationAssetItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Asset Capitalization Asset Item.
 */
export async function createAssetCapitalizationAssetItem(db: any, data: unknown) {
  const parsed = AssetCapitalizationAssetItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(assetCapitalizationAssetItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Asset Capitalization Asset Item.
 */
export async function updateAssetCapitalizationAssetItem(db: any, id: string, data: unknown) {
  const parsed = AssetCapitalizationAssetItemInsertSchema.partial().parse(data);
  await db.update(assetCapitalizationAssetItem).set({ ...parsed, modified: new Date() }).where(eq(assetCapitalizationAssetItem.id, id));
  return getAssetCapitalizationAssetItem(db, id);
}

/**
 * Delete a Asset Capitalization Asset Item by ID.
 */
export async function deleteAssetCapitalizationAssetItem(db: any, id: string) {
  await db.delete(assetCapitalizationAssetItem).where(eq(assetCapitalizationAssetItem.id, id));
  return { deleted: true, id };
}
