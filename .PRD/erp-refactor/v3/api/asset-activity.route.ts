// CRUD API handlers for Asset Activity
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { assetActivity } from '../db/schema.js';
import { AssetActivitySchema, AssetActivityInsertSchema } from '../types/asset-activity.js';

export const ROUTE_PREFIX = '/asset-activity';

/**
 * List Asset Activity records.
 */
export async function listAssetActivity(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(assetActivity).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Asset Activity by ID.
 */
export async function getAssetActivity(db: any, id: string) {
  const rows = await db.select().from(assetActivity).where(eq(assetActivity.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Asset Activity.
 */
export async function createAssetActivity(db: any, data: unknown) {
  const parsed = AssetActivityInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(assetActivity).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Asset Activity.
 */
export async function updateAssetActivity(db: any, id: string, data: unknown) {
  const parsed = AssetActivityInsertSchema.partial().parse(data);
  await db.update(assetActivity).set({ ...parsed, modified: new Date() }).where(eq(assetActivity.id, id));
  return getAssetActivity(db, id);
}

/**
 * Delete a Asset Activity by ID.
 */
export async function deleteAssetActivity(db: any, id: string) {
  await db.delete(assetActivity).where(eq(assetActivity.id, id));
  return { deleted: true, id };
}
