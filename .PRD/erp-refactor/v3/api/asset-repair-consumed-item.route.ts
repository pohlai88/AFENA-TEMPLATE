// CRUD API handlers for Asset Repair Consumed Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { assetRepairConsumedItem } from '../db/schema.js';
import { AssetRepairConsumedItemSchema, AssetRepairConsumedItemInsertSchema } from '../types/asset-repair-consumed-item.js';

export const ROUTE_PREFIX = '/asset-repair-consumed-item';

/**
 * List Asset Repair Consumed Item records.
 */
export async function listAssetRepairConsumedItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(assetRepairConsumedItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Asset Repair Consumed Item by ID.
 */
export async function getAssetRepairConsumedItem(db: any, id: string) {
  const rows = await db.select().from(assetRepairConsumedItem).where(eq(assetRepairConsumedItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Asset Repair Consumed Item.
 */
export async function createAssetRepairConsumedItem(db: any, data: unknown) {
  const parsed = AssetRepairConsumedItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(assetRepairConsumedItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Asset Repair Consumed Item.
 */
export async function updateAssetRepairConsumedItem(db: any, id: string, data: unknown) {
  const parsed = AssetRepairConsumedItemInsertSchema.partial().parse(data);
  await db.update(assetRepairConsumedItem).set({ ...parsed, modified: new Date() }).where(eq(assetRepairConsumedItem.id, id));
  return getAssetRepairConsumedItem(db, id);
}

/**
 * Delete a Asset Repair Consumed Item by ID.
 */
export async function deleteAssetRepairConsumedItem(db: any, id: string) {
  await db.delete(assetRepairConsumedItem).where(eq(assetRepairConsumedItem.id, id));
  return { deleted: true, id };
}
