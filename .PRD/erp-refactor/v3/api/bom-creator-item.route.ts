// CRUD API handlers for BOM Creator Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { bomCreatorItem } from '../db/schema.js';
import { BomCreatorItemSchema, BomCreatorItemInsertSchema } from '../types/bom-creator-item.js';

export const ROUTE_PREFIX = '/bom-creator-item';

/**
 * List BOM Creator Item records.
 */
export async function listBomCreatorItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(bomCreatorItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single BOM Creator Item by ID.
 */
export async function getBomCreatorItem(db: any, id: string) {
  const rows = await db.select().from(bomCreatorItem).where(eq(bomCreatorItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new BOM Creator Item.
 */
export async function createBomCreatorItem(db: any, data: unknown) {
  const parsed = BomCreatorItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(bomCreatorItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing BOM Creator Item.
 */
export async function updateBomCreatorItem(db: any, id: string, data: unknown) {
  const parsed = BomCreatorItemInsertSchema.partial().parse(data);
  await db.update(bomCreatorItem).set({ ...parsed, modified: new Date() }).where(eq(bomCreatorItem.id, id));
  return getBomCreatorItem(db, id);
}

/**
 * Delete a BOM Creator Item by ID.
 */
export async function deleteBomCreatorItem(db: any, id: string) {
  await db.delete(bomCreatorItem).where(eq(bomCreatorItem.id, id));
  return { deleted: true, id };
}
