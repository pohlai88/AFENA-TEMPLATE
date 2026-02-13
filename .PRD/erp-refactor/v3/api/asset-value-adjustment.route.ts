// CRUD API handlers for Asset Value Adjustment
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { assetValueAdjustment } from '../db/schema.js';
import { AssetValueAdjustmentSchema, AssetValueAdjustmentInsertSchema } from '../types/asset-value-adjustment.js';

export const ROUTE_PREFIX = '/asset-value-adjustment';

/**
 * List Asset Value Adjustment records.
 */
export async function listAssetValueAdjustment(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(assetValueAdjustment).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Asset Value Adjustment by ID.
 */
export async function getAssetValueAdjustment(db: any, id: string) {
  const rows = await db.select().from(assetValueAdjustment).where(eq(assetValueAdjustment.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Asset Value Adjustment.
 */
export async function createAssetValueAdjustment(db: any, data: unknown) {
  const parsed = AssetValueAdjustmentInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(assetValueAdjustment).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Asset Value Adjustment.
 */
export async function updateAssetValueAdjustment(db: any, id: string, data: unknown) {
  const parsed = AssetValueAdjustmentInsertSchema.partial().parse(data);
  await db.update(assetValueAdjustment).set({ ...parsed, modified: new Date() }).where(eq(assetValueAdjustment.id, id));
  return getAssetValueAdjustment(db, id);
}

/**
 * Delete a Asset Value Adjustment by ID.
 */
export async function deleteAssetValueAdjustment(db: any, id: string) {
  await db.delete(assetValueAdjustment).where(eq(assetValueAdjustment.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Asset Value Adjustment (set docstatus = 1).
 */
export async function submitAssetValueAdjustment(db: any, id: string) {
  await db.update(assetValueAdjustment).set({ docstatus: 1, modified: new Date() }).where(eq(assetValueAdjustment.id, id));
  return getAssetValueAdjustment(db, id);
}

/**
 * Cancel a Asset Value Adjustment (set docstatus = 2).
 */
export async function cancelAssetValueAdjustment(db: any, id: string) {
  await db.update(assetValueAdjustment).set({ docstatus: 2, modified: new Date() }).where(eq(assetValueAdjustment.id, id));
  return getAssetValueAdjustment(db, id);
}
