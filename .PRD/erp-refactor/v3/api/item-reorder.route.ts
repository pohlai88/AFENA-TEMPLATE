// CRUD API handlers for Item Reorder
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { itemReorder } from '../db/schema.js';
import { ItemReorderSchema, ItemReorderInsertSchema } from '../types/item-reorder.js';

export const ROUTE_PREFIX = '/item-reorder';

/**
 * List Item Reorder records.
 */
export async function listItemReorder(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(itemReorder).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Item Reorder by ID.
 */
export async function getItemReorder(db: any, id: string) {
  const rows = await db.select().from(itemReorder).where(eq(itemReorder.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Item Reorder.
 */
export async function createItemReorder(db: any, data: unknown) {
  const parsed = ItemReorderInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(itemReorder).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Item Reorder.
 */
export async function updateItemReorder(db: any, id: string, data: unknown) {
  const parsed = ItemReorderInsertSchema.partial().parse(data);
  await db.update(itemReorder).set({ ...parsed, modified: new Date() }).where(eq(itemReorder.id, id));
  return getItemReorder(db, id);
}

/**
 * Delete a Item Reorder by ID.
 */
export async function deleteItemReorder(db: any, id: string) {
  await db.delete(itemReorder).where(eq(itemReorder.id, id));
  return { deleted: true, id };
}
