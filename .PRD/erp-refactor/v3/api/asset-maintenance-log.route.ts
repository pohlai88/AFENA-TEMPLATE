// CRUD API handlers for Asset Maintenance Log
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { assetMaintenanceLog } from '../db/schema.js';
import { AssetMaintenanceLogSchema, AssetMaintenanceLogInsertSchema } from '../types/asset-maintenance-log.js';

export const ROUTE_PREFIX = '/asset-maintenance-log';

/**
 * List Asset Maintenance Log records.
 */
export async function listAssetMaintenanceLog(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(assetMaintenanceLog).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Asset Maintenance Log by ID.
 */
export async function getAssetMaintenanceLog(db: any, id: string) {
  const rows = await db.select().from(assetMaintenanceLog).where(eq(assetMaintenanceLog.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Asset Maintenance Log.
 */
export async function createAssetMaintenanceLog(db: any, data: unknown) {
  const parsed = AssetMaintenanceLogInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(assetMaintenanceLog).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Asset Maintenance Log.
 */
export async function updateAssetMaintenanceLog(db: any, id: string, data: unknown) {
  const parsed = AssetMaintenanceLogInsertSchema.partial().parse(data);
  await db.update(assetMaintenanceLog).set({ ...parsed, modified: new Date() }).where(eq(assetMaintenanceLog.id, id));
  return getAssetMaintenanceLog(db, id);
}

/**
 * Delete a Asset Maintenance Log by ID.
 */
export async function deleteAssetMaintenanceLog(db: any, id: string) {
  await db.delete(assetMaintenanceLog).where(eq(assetMaintenanceLog.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Asset Maintenance Log (set docstatus = 1).
 */
export async function submitAssetMaintenanceLog(db: any, id: string) {
  await db.update(assetMaintenanceLog).set({ docstatus: 1, modified: new Date() }).where(eq(assetMaintenanceLog.id, id));
  return getAssetMaintenanceLog(db, id);
}

/**
 * Cancel a Asset Maintenance Log (set docstatus = 2).
 */
export async function cancelAssetMaintenanceLog(db: any, id: string) {
  await db.update(assetMaintenanceLog).set({ docstatus: 2, modified: new Date() }).where(eq(assetMaintenanceLog.id, id));
  return getAssetMaintenanceLog(db, id);
}
