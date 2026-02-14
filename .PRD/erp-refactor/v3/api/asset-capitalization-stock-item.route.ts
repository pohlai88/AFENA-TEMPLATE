// CRUD API handlers for Asset Capitalization Stock Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { assetCapitalizationStockItem } from '../db/schema.js';
import { AssetCapitalizationStockItemSchema, AssetCapitalizationStockItemInsertSchema } from '../types/asset-capitalization-stock-item.js';

export const ROUTE_PREFIX = '/asset-capitalization-stock-item';

/**
 * List Asset Capitalization Stock Item records.
 */
export async function listAssetCapitalizationStockItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(assetCapitalizationStockItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Asset Capitalization Stock Item by ID.
 */
export async function getAssetCapitalizationStockItem(db: any, id: string) {
  const rows = await db.select().from(assetCapitalizationStockItem).where(eq(assetCapitalizationStockItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Asset Capitalization Stock Item.
 */
export async function createAssetCapitalizationStockItem(db: any, data: unknown) {
  const parsed = AssetCapitalizationStockItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(assetCapitalizationStockItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Asset Capitalization Stock Item.
 */
export async function updateAssetCapitalizationStockItem(db: any, id: string, data: unknown) {
  const parsed = AssetCapitalizationStockItemInsertSchema.partial().parse(data);
  await db.update(assetCapitalizationStockItem).set({ ...parsed, modified: new Date() }).where(eq(assetCapitalizationStockItem.id, id));
  return getAssetCapitalizationStockItem(db, id);
}

/**
 * Delete a Asset Capitalization Stock Item by ID.
 */
export async function deleteAssetCapitalizationStockItem(db: any, id: string) {
  await db.delete(assetCapitalizationStockItem).where(eq(assetCapitalizationStockItem.id, id));
  return { deleted: true, id };
}
