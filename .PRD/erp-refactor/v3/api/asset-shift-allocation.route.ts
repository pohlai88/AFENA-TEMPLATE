// CRUD API handlers for Asset Shift Allocation
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { assetShiftAllocation } from '../db/schema.js';
import { AssetShiftAllocationSchema, AssetShiftAllocationInsertSchema } from '../types/asset-shift-allocation.js';

export const ROUTE_PREFIX = '/asset-shift-allocation';

/**
 * List Asset Shift Allocation records.
 */
export async function listAssetShiftAllocation(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(assetShiftAllocation).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Asset Shift Allocation by ID.
 */
export async function getAssetShiftAllocation(db: any, id: string) {
  const rows = await db.select().from(assetShiftAllocation).where(eq(assetShiftAllocation.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Asset Shift Allocation.
 */
export async function createAssetShiftAllocation(db: any, data: unknown) {
  const parsed = AssetShiftAllocationInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(assetShiftAllocation).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Asset Shift Allocation.
 */
export async function updateAssetShiftAllocation(db: any, id: string, data: unknown) {
  const parsed = AssetShiftAllocationInsertSchema.partial().parse(data);
  await db.update(assetShiftAllocation).set({ ...parsed, modified: new Date() }).where(eq(assetShiftAllocation.id, id));
  return getAssetShiftAllocation(db, id);
}

/**
 * Delete a Asset Shift Allocation by ID.
 */
export async function deleteAssetShiftAllocation(db: any, id: string) {
  await db.delete(assetShiftAllocation).where(eq(assetShiftAllocation.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Asset Shift Allocation (set docstatus = 1).
 */
export async function submitAssetShiftAllocation(db: any, id: string) {
  await db.update(assetShiftAllocation).set({ docstatus: 1, modified: new Date() }).where(eq(assetShiftAllocation.id, id));
  return getAssetShiftAllocation(db, id);
}

/**
 * Cancel a Asset Shift Allocation (set docstatus = 2).
 */
export async function cancelAssetShiftAllocation(db: any, id: string) {
  await db.update(assetShiftAllocation).set({ docstatus: 2, modified: new Date() }).where(eq(assetShiftAllocation.id, id));
  return getAssetShiftAllocation(db, id);
}
