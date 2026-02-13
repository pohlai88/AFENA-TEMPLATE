// CRUD API handlers for Asset Capitalization
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { assetCapitalization } from '../db/schema.js';
import { AssetCapitalizationSchema, AssetCapitalizationInsertSchema } from '../types/asset-capitalization.js';

export const ROUTE_PREFIX = '/asset-capitalization';

/**
 * List Asset Capitalization records.
 */
export async function listAssetCapitalization(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(assetCapitalization).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Asset Capitalization by ID.
 */
export async function getAssetCapitalization(db: any, id: string) {
  const rows = await db.select().from(assetCapitalization).where(eq(assetCapitalization.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Asset Capitalization.
 */
export async function createAssetCapitalization(db: any, data: unknown) {
  const parsed = AssetCapitalizationInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(assetCapitalization).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Asset Capitalization.
 */
export async function updateAssetCapitalization(db: any, id: string, data: unknown) {
  const parsed = AssetCapitalizationInsertSchema.partial().parse(data);
  await db.update(assetCapitalization).set({ ...parsed, modified: new Date() }).where(eq(assetCapitalization.id, id));
  return getAssetCapitalization(db, id);
}

/**
 * Delete a Asset Capitalization by ID.
 */
export async function deleteAssetCapitalization(db: any, id: string) {
  await db.delete(assetCapitalization).where(eq(assetCapitalization.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Asset Capitalization (set docstatus = 1).
 */
export async function submitAssetCapitalization(db: any, id: string) {
  await db.update(assetCapitalization).set({ docstatus: 1, modified: new Date() }).where(eq(assetCapitalization.id, id));
  return getAssetCapitalization(db, id);
}

/**
 * Cancel a Asset Capitalization (set docstatus = 2).
 */
export async function cancelAssetCapitalization(db: any, id: string) {
  await db.update(assetCapitalization).set({ docstatus: 2, modified: new Date() }).where(eq(assetCapitalization.id, id));
  return getAssetCapitalization(db, id);
}
