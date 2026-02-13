// CRUD API handlers for Item Default
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { itemDefault } from '../db/schema.js';
import { ItemDefaultSchema, ItemDefaultInsertSchema } from '../types/item-default.js';

export const ROUTE_PREFIX = '/item-default';

/**
 * List Item Default records.
 */
export async function listItemDefault(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(itemDefault).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Item Default by ID.
 */
export async function getItemDefault(db: any, id: string) {
  const rows = await db.select().from(itemDefault).where(eq(itemDefault.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Item Default.
 */
export async function createItemDefault(db: any, data: unknown) {
  const parsed = ItemDefaultInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(itemDefault).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Item Default.
 */
export async function updateItemDefault(db: any, id: string, data: unknown) {
  const parsed = ItemDefaultInsertSchema.partial().parse(data);
  await db.update(itemDefault).set({ ...parsed, modified: new Date() }).where(eq(itemDefault.id, id));
  return getItemDefault(db, id);
}

/**
 * Delete a Item Default by ID.
 */
export async function deleteItemDefault(db: any, id: string) {
  await db.delete(itemDefault).where(eq(itemDefault.id, id));
  return { deleted: true, id };
}
