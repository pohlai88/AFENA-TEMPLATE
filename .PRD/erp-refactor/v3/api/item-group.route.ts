// CRUD API handlers for Item Group
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { itemGroup } from '../db/schema.js';
import { ItemGroupSchema, ItemGroupInsertSchema } from '../types/item-group.js';

export const ROUTE_PREFIX = '/item-group';

/**
 * List Item Group records.
 */
export async function listItemGroup(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(itemGroup).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Item Group by ID.
 */
export async function getItemGroup(db: any, id: string) {
  const rows = await db.select().from(itemGroup).where(eq(itemGroup.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Item Group.
 */
export async function createItemGroup(db: any, data: unknown) {
  const parsed = ItemGroupInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(itemGroup).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Item Group.
 */
export async function updateItemGroup(db: any, id: string, data: unknown) {
  const parsed = ItemGroupInsertSchema.partial().parse(data);
  await db.update(itemGroup).set({ ...parsed, modified: new Date() }).where(eq(itemGroup.id, id));
  return getItemGroup(db, id);
}

/**
 * Delete a Item Group by ID.
 */
export async function deleteItemGroup(db: any, id: string) {
  await db.delete(itemGroup).where(eq(itemGroup.id, id));
  return { deleted: true, id };
}
