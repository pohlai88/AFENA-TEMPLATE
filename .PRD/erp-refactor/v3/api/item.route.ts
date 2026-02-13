// CRUD API handlers for Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { item } from '../db/schema.js';
import { ItemSchema, ItemInsertSchema } from '../types/item.js';

export const ROUTE_PREFIX = '/item';

/**
 * List Item records.
 */
export async function listItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(item).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Item by ID.
 */
export async function getItem(db: any, id: string) {
  const rows = await db.select().from(item).where(eq(item.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Item.
 */
export async function createItem(db: any, data: unknown) {
  const parsed = ItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(item).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Item.
 */
export async function updateItem(db: any, id: string, data: unknown) {
  const parsed = ItemInsertSchema.partial().parse(data);
  await db.update(item).set({ ...parsed, modified: new Date() }).where(eq(item.id, id));
  return getItem(db, id);
}

/**
 * Delete a Item by ID.
 */
export async function deleteItem(db: any, id: string) {
  await db.delete(item).where(eq(item.id, id));
  return { deleted: true, id };
}
