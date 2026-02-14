// CRUD API handlers for Asset Movement
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { assetMovement } from '../db/schema.js';
import { AssetMovementSchema, AssetMovementInsertSchema } from '../types/asset-movement.js';

export const ROUTE_PREFIX = '/asset-movement';

/**
 * List Asset Movement records.
 */
export async function listAssetMovement(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(assetMovement).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Asset Movement by ID.
 */
export async function getAssetMovement(db: any, id: string) {
  const rows = await db.select().from(assetMovement).where(eq(assetMovement.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Asset Movement.
 */
export async function createAssetMovement(db: any, data: unknown) {
  const parsed = AssetMovementInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(assetMovement).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Asset Movement.
 */
export async function updateAssetMovement(db: any, id: string, data: unknown) {
  const parsed = AssetMovementInsertSchema.partial().parse(data);
  await db.update(assetMovement).set({ ...parsed, modified: new Date() }).where(eq(assetMovement.id, id));
  return getAssetMovement(db, id);
}

/**
 * Delete a Asset Movement by ID.
 */
export async function deleteAssetMovement(db: any, id: string) {
  await db.delete(assetMovement).where(eq(assetMovement.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Asset Movement (set docstatus = 1).
 */
export async function submitAssetMovement(db: any, id: string) {
  await db.update(assetMovement).set({ docstatus: 1, modified: new Date() }).where(eq(assetMovement.id, id));
  return getAssetMovement(db, id);
}

/**
 * Cancel a Asset Movement (set docstatus = 2).
 */
export async function cancelAssetMovement(db: any, id: string) {
  await db.update(assetMovement).set({ docstatus: 2, modified: new Date() }).where(eq(assetMovement.id, id));
  return getAssetMovement(db, id);
}
