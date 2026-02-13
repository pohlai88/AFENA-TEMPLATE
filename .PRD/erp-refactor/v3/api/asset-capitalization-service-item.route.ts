// CRUD API handlers for Asset Capitalization Service Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { assetCapitalizationServiceItem } from '../db/schema.js';
import { AssetCapitalizationServiceItemSchema, AssetCapitalizationServiceItemInsertSchema } from '../types/asset-capitalization-service-item.js';

export const ROUTE_PREFIX = '/asset-capitalization-service-item';

/**
 * List Asset Capitalization Service Item records.
 */
export async function listAssetCapitalizationServiceItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(assetCapitalizationServiceItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Asset Capitalization Service Item by ID.
 */
export async function getAssetCapitalizationServiceItem(db: any, id: string) {
  const rows = await db.select().from(assetCapitalizationServiceItem).where(eq(assetCapitalizationServiceItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Asset Capitalization Service Item.
 */
export async function createAssetCapitalizationServiceItem(db: any, data: unknown) {
  const parsed = AssetCapitalizationServiceItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(assetCapitalizationServiceItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Asset Capitalization Service Item.
 */
export async function updateAssetCapitalizationServiceItem(db: any, id: string, data: unknown) {
  const parsed = AssetCapitalizationServiceItemInsertSchema.partial().parse(data);
  await db.update(assetCapitalizationServiceItem).set({ ...parsed, modified: new Date() }).where(eq(assetCapitalizationServiceItem.id, id));
  return getAssetCapitalizationServiceItem(db, id);
}

/**
 * Delete a Asset Capitalization Service Item by ID.
 */
export async function deleteAssetCapitalizationServiceItem(db: any, id: string) {
  await db.delete(assetCapitalizationServiceItem).where(eq(assetCapitalizationServiceItem.id, id));
  return { deleted: true, id };
}
