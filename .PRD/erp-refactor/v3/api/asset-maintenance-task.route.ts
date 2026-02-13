// CRUD API handlers for Asset Maintenance Task
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { assetMaintenanceTask } from '../db/schema.js';
import { AssetMaintenanceTaskSchema, AssetMaintenanceTaskInsertSchema } from '../types/asset-maintenance-task.js';

export const ROUTE_PREFIX = '/asset-maintenance-task';

/**
 * List Asset Maintenance Task records.
 */
export async function listAssetMaintenanceTask(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(assetMaintenanceTask).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Asset Maintenance Task by ID.
 */
export async function getAssetMaintenanceTask(db: any, id: string) {
  const rows = await db.select().from(assetMaintenanceTask).where(eq(assetMaintenanceTask.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Asset Maintenance Task.
 */
export async function createAssetMaintenanceTask(db: any, data: unknown) {
  const parsed = AssetMaintenanceTaskInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(assetMaintenanceTask).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Asset Maintenance Task.
 */
export async function updateAssetMaintenanceTask(db: any, id: string, data: unknown) {
  const parsed = AssetMaintenanceTaskInsertSchema.partial().parse(data);
  await db.update(assetMaintenanceTask).set({ ...parsed, modified: new Date() }).where(eq(assetMaintenanceTask.id, id));
  return getAssetMaintenanceTask(db, id);
}

/**
 * Delete a Asset Maintenance Task by ID.
 */
export async function deleteAssetMaintenanceTask(db: any, id: string) {
  await db.delete(assetMaintenanceTask).where(eq(assetMaintenanceTask.id, id));
  return { deleted: true, id };
}
