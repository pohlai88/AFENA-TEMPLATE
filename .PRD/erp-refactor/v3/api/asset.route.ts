// CRUD API handlers for Asset
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { asset } from '../db/schema.js';
import { AssetSchema, AssetInsertSchema } from '../types/asset.js';

export const ROUTE_PREFIX = '/asset';

/**
 * List Asset records.
 */
export async function listAsset(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(asset).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Asset by ID.
 */
export async function getAsset(db: any, id: string) {
  const rows = await db.select().from(asset).where(eq(asset.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Asset.
 */
export async function createAsset(db: any, data: unknown) {
  const parsed = AssetInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(asset).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Asset.
 */
export async function updateAsset(db: any, id: string, data: unknown) {
  const parsed = AssetInsertSchema.partial().parse(data);
  await db.update(asset).set({ ...parsed, modified: new Date() }).where(eq(asset.id, id));
  return getAsset(db, id);
}

/**
 * Delete a Asset by ID.
 */
export async function deleteAsset(db: any, id: string) {
  await db.delete(asset).where(eq(asset.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Asset (set docstatus = 1).
 */
export async function submitAsset(db: any, id: string) {
  await db.update(asset).set({ docstatus: 1, modified: new Date() }).where(eq(asset.id, id));
  return getAsset(db, id);
}

/**
 * Cancel a Asset (set docstatus = 2).
 */
export async function cancelAsset(db: any, id: string) {
  await db.update(asset).set({ docstatus: 2, modified: new Date() }).where(eq(asset.id, id));
  return getAsset(db, id);
}
