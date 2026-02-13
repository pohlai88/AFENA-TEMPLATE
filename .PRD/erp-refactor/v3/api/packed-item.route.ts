// CRUD API handlers for Packed Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { packedItem } from '../db/schema.js';
import { PackedItemSchema, PackedItemInsertSchema } from '../types/packed-item.js';

export const ROUTE_PREFIX = '/packed-item';

/**
 * List Packed Item records.
 */
export async function listPackedItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(packedItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Packed Item by ID.
 */
export async function getPackedItem(db: any, id: string) {
  const rows = await db.select().from(packedItem).where(eq(packedItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Packed Item.
 */
export async function createPackedItem(db: any, data: unknown) {
  const parsed = PackedItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(packedItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Packed Item.
 */
export async function updatePackedItem(db: any, id: string, data: unknown) {
  const parsed = PackedItemInsertSchema.partial().parse(data);
  await db.update(packedItem).set({ ...parsed, modified: new Date() }).where(eq(packedItem.id, id));
  return getPackedItem(db, id);
}

/**
 * Delete a Packed Item by ID.
 */
export async function deletePackedItem(db: any, id: string) {
  await db.delete(packedItem).where(eq(packedItem.id, id));
  return { deleted: true, id };
}
