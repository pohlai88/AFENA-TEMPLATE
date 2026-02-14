// CRUD API handlers for Item Attribute Value
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { itemAttributeValue } from '../db/schema.js';
import { ItemAttributeValueSchema, ItemAttributeValueInsertSchema } from '../types/item-attribute-value.js';

export const ROUTE_PREFIX = '/item-attribute-value';

/**
 * List Item Attribute Value records.
 */
export async function listItemAttributeValue(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(itemAttributeValue).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Item Attribute Value by ID.
 */
export async function getItemAttributeValue(db: any, id: string) {
  const rows = await db.select().from(itemAttributeValue).where(eq(itemAttributeValue.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Item Attribute Value.
 */
export async function createItemAttributeValue(db: any, data: unknown) {
  const parsed = ItemAttributeValueInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(itemAttributeValue).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Item Attribute Value.
 */
export async function updateItemAttributeValue(db: any, id: string, data: unknown) {
  const parsed = ItemAttributeValueInsertSchema.partial().parse(data);
  await db.update(itemAttributeValue).set({ ...parsed, modified: new Date() }).where(eq(itemAttributeValue.id, id));
  return getItemAttributeValue(db, id);
}

/**
 * Delete a Item Attribute Value by ID.
 */
export async function deleteItemAttributeValue(db: any, id: string) {
  await db.delete(itemAttributeValue).where(eq(itemAttributeValue.id, id));
  return { deleted: true, id };
}
