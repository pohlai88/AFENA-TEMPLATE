// CRUD API handlers for Asset Shift Factor
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { assetShiftFactor } from '../db/schema.js';
import { AssetShiftFactorSchema, AssetShiftFactorInsertSchema } from '../types/asset-shift-factor.js';

export const ROUTE_PREFIX = '/asset-shift-factor';

/**
 * List Asset Shift Factor records.
 */
export async function listAssetShiftFactor(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(assetShiftFactor).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Asset Shift Factor by ID.
 */
export async function getAssetShiftFactor(db: any, id: string) {
  const rows = await db.select().from(assetShiftFactor).where(eq(assetShiftFactor.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Asset Shift Factor.
 */
export async function createAssetShiftFactor(db: any, data: unknown) {
  const parsed = AssetShiftFactorInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(assetShiftFactor).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Asset Shift Factor.
 */
export async function updateAssetShiftFactor(db: any, id: string, data: unknown) {
  const parsed = AssetShiftFactorInsertSchema.partial().parse(data);
  await db.update(assetShiftFactor).set({ ...parsed, modified: new Date() }).where(eq(assetShiftFactor.id, id));
  return getAssetShiftFactor(db, id);
}

/**
 * Delete a Asset Shift Factor by ID.
 */
export async function deleteAssetShiftFactor(db: any, id: string) {
  await db.delete(assetShiftFactor).where(eq(assetShiftFactor.id, id));
  return { deleted: true, id };
}
