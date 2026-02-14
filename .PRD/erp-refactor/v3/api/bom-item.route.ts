// CRUD API handlers for BOM Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { bomItem } from '../db/schema.js';
import { BomItemSchema, BomItemInsertSchema } from '../types/bom-item.js';

export const ROUTE_PREFIX = '/bom-item';

/**
 * List BOM Item records.
 */
export async function listBomItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(bomItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single BOM Item by ID.
 */
export async function getBomItem(db: any, id: string) {
  const rows = await db.select().from(bomItem).where(eq(bomItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new BOM Item.
 */
export async function createBomItem(db: any, data: unknown) {
  const parsed = BomItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(bomItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing BOM Item.
 */
export async function updateBomItem(db: any, id: string, data: unknown) {
  const parsed = BomItemInsertSchema.partial().parse(data);
  await db.update(bomItem).set({ ...parsed, modified: new Date() }).where(eq(bomItem.id, id));
  return getBomItem(db, id);
}

/**
 * Delete a BOM Item by ID.
 */
export async function deleteBomItem(db: any, id: string) {
  await db.delete(bomItem).where(eq(bomItem.id, id));
  return { deleted: true, id };
}
