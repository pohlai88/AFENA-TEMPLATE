// CRUD API handlers for Asset Repair
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { assetRepair } from '../db/schema.js';
import { AssetRepairSchema, AssetRepairInsertSchema } from '../types/asset-repair.js';

export const ROUTE_PREFIX = '/asset-repair';

/**
 * List Asset Repair records.
 */
export async function listAssetRepair(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(assetRepair).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Asset Repair by ID.
 */
export async function getAssetRepair(db: any, id: string) {
  const rows = await db.select().from(assetRepair).where(eq(assetRepair.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Asset Repair.
 */
export async function createAssetRepair(db: any, data: unknown) {
  const parsed = AssetRepairInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(assetRepair).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Asset Repair.
 */
export async function updateAssetRepair(db: any, id: string, data: unknown) {
  const parsed = AssetRepairInsertSchema.partial().parse(data);
  await db.update(assetRepair).set({ ...parsed, modified: new Date() }).where(eq(assetRepair.id, id));
  return getAssetRepair(db, id);
}

/**
 * Delete a Asset Repair by ID.
 */
export async function deleteAssetRepair(db: any, id: string) {
  await db.delete(assetRepair).where(eq(assetRepair.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Asset Repair (set docstatus = 1).
 */
export async function submitAssetRepair(db: any, id: string) {
  await db.update(assetRepair).set({ docstatus: 1, modified: new Date() }).where(eq(assetRepair.id, id));
  return getAssetRepair(db, id);
}

/**
 * Cancel a Asset Repair (set docstatus = 2).
 */
export async function cancelAssetRepair(db: any, id: string) {
  await db.update(assetRepair).set({ docstatus: 2, modified: new Date() }).where(eq(assetRepair.id, id));
  return getAssetRepair(db, id);
}
