// CRUD API handlers for Asset Maintenance
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { assetMaintenance } from '../db/schema.js';
import { AssetMaintenanceSchema, AssetMaintenanceInsertSchema } from '../types/asset-maintenance.js';

export const ROUTE_PREFIX = '/asset-maintenance';

/**
 * List Asset Maintenance records.
 */
export async function listAssetMaintenance(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(assetMaintenance).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Asset Maintenance by ID.
 */
export async function getAssetMaintenance(db: any, id: string) {
  const rows = await db.select().from(assetMaintenance).where(eq(assetMaintenance.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Asset Maintenance.
 */
export async function createAssetMaintenance(db: any, data: unknown) {
  const parsed = AssetMaintenanceInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(assetMaintenance).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Asset Maintenance.
 */
export async function updateAssetMaintenance(db: any, id: string, data: unknown) {
  const parsed = AssetMaintenanceInsertSchema.partial().parse(data);
  await db.update(assetMaintenance).set({ ...parsed, modified: new Date() }).where(eq(assetMaintenance.id, id));
  return getAssetMaintenance(db, id);
}

/**
 * Delete a Asset Maintenance by ID.
 */
export async function deleteAssetMaintenance(db: any, id: string) {
  await db.delete(assetMaintenance).where(eq(assetMaintenance.id, id));
  return { deleted: true, id };
}
