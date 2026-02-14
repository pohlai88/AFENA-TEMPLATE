// CRUD API handlers for Asset Movement Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { assetMovementItem } from '../db/schema.js';
import { AssetMovementItemSchema, AssetMovementItemInsertSchema } from '../types/asset-movement-item.js';

export const ROUTE_PREFIX = '/asset-movement-item';

/**
 * List Asset Movement Item records.
 */
export async function listAssetMovementItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(assetMovementItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Asset Movement Item by ID.
 */
export async function getAssetMovementItem(db: any, id: string) {
  const rows = await db.select().from(assetMovementItem).where(eq(assetMovementItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Asset Movement Item.
 */
export async function createAssetMovementItem(db: any, data: unknown) {
  const parsed = AssetMovementItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(assetMovementItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Asset Movement Item.
 */
export async function updateAssetMovementItem(db: any, id: string, data: unknown) {
  const parsed = AssetMovementItemInsertSchema.partial().parse(data);
  await db.update(assetMovementItem).set({ ...parsed, modified: new Date() }).where(eq(assetMovementItem.id, id));
  return getAssetMovementItem(db, id);
}

/**
 * Delete a Asset Movement Item by ID.
 */
export async function deleteAssetMovementItem(db: any, id: string) {
  await db.delete(assetMovementItem).where(eq(assetMovementItem.id, id));
  return { deleted: true, id };
}
