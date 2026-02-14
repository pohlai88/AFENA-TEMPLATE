// CRUD API handlers for Item Attribute
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { itemAttribute } from '../db/schema.js';
import { ItemAttributeSchema, ItemAttributeInsertSchema } from '../types/item-attribute.js';

export const ROUTE_PREFIX = '/item-attribute';

/**
 * List Item Attribute records.
 */
export async function listItemAttribute(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(itemAttribute).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Item Attribute by ID.
 */
export async function getItemAttribute(db: any, id: string) {
  const rows = await db.select().from(itemAttribute).where(eq(itemAttribute.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Item Attribute.
 */
export async function createItemAttribute(db: any, data: unknown) {
  const parsed = ItemAttributeInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(itemAttribute).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Item Attribute.
 */
export async function updateItemAttribute(db: any, id: string, data: unknown) {
  const parsed = ItemAttributeInsertSchema.partial().parse(data);
  await db.update(itemAttribute).set({ ...parsed, modified: new Date() }).where(eq(itemAttribute.id, id));
  return getItemAttribute(db, id);
}

/**
 * Delete a Item Attribute by ID.
 */
export async function deleteItemAttribute(db: any, id: string) {
  await db.delete(itemAttribute).where(eq(itemAttribute.id, id));
  return { deleted: true, id };
}
