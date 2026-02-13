// CRUD API handlers for Item Alternative
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { itemAlternative } from '../db/schema.js';
import { ItemAlternativeSchema, ItemAlternativeInsertSchema } from '../types/item-alternative.js';

export const ROUTE_PREFIX = '/item-alternative';

/**
 * List Item Alternative records.
 */
export async function listItemAlternative(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(itemAlternative).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Item Alternative by ID.
 */
export async function getItemAlternative(db: any, id: string) {
  const rows = await db.select().from(itemAlternative).where(eq(itemAlternative.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Item Alternative.
 */
export async function createItemAlternative(db: any, data: unknown) {
  const parsed = ItemAlternativeInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(itemAlternative).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Item Alternative.
 */
export async function updateItemAlternative(db: any, id: string, data: unknown) {
  const parsed = ItemAlternativeInsertSchema.partial().parse(data);
  await db.update(itemAlternative).set({ ...parsed, modified: new Date() }).where(eq(itemAlternative.id, id));
  return getItemAlternative(db, id);
}

/**
 * Delete a Item Alternative by ID.
 */
export async function deleteItemAlternative(db: any, id: string) {
  await db.delete(itemAlternative).where(eq(itemAlternative.id, id));
  return { deleted: true, id };
}
