// CRUD API handlers for Asset Depreciation Schedule
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { assetDepreciationSchedule } from '../db/schema.js';
import { AssetDepreciationScheduleSchema, AssetDepreciationScheduleInsertSchema } from '../types/asset-depreciation-schedule.js';

export const ROUTE_PREFIX = '/asset-depreciation-schedule';

/**
 * List Asset Depreciation Schedule records.
 */
export async function listAssetDepreciationSchedule(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(assetDepreciationSchedule).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Asset Depreciation Schedule by ID.
 */
export async function getAssetDepreciationSchedule(db: any, id: string) {
  const rows = await db.select().from(assetDepreciationSchedule).where(eq(assetDepreciationSchedule.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Asset Depreciation Schedule.
 */
export async function createAssetDepreciationSchedule(db: any, data: unknown) {
  const parsed = AssetDepreciationScheduleInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(assetDepreciationSchedule).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Asset Depreciation Schedule.
 */
export async function updateAssetDepreciationSchedule(db: any, id: string, data: unknown) {
  const parsed = AssetDepreciationScheduleInsertSchema.partial().parse(data);
  await db.update(assetDepreciationSchedule).set({ ...parsed, modified: new Date() }).where(eq(assetDepreciationSchedule.id, id));
  return getAssetDepreciationSchedule(db, id);
}

/**
 * Delete a Asset Depreciation Schedule by ID.
 */
export async function deleteAssetDepreciationSchedule(db: any, id: string) {
  await db.delete(assetDepreciationSchedule).where(eq(assetDepreciationSchedule.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Asset Depreciation Schedule (set docstatus = 1).
 */
export async function submitAssetDepreciationSchedule(db: any, id: string) {
  await db.update(assetDepreciationSchedule).set({ docstatus: 1, modified: new Date() }).where(eq(assetDepreciationSchedule.id, id));
  return getAssetDepreciationSchedule(db, id);
}

/**
 * Cancel a Asset Depreciation Schedule (set docstatus = 2).
 */
export async function cancelAssetDepreciationSchedule(db: any, id: string) {
  await db.update(assetDepreciationSchedule).set({ docstatus: 2, modified: new Date() }).where(eq(assetDepreciationSchedule.id, id));
  return getAssetDepreciationSchedule(db, id);
}
