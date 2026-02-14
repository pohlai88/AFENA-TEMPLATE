// CRUD API handlers for Item Variant Attribute
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { itemVariantAttribute } from '../db/schema.js';
import { ItemVariantAttributeSchema, ItemVariantAttributeInsertSchema } from '../types/item-variant-attribute.js';

export const ROUTE_PREFIX = '/item-variant-attribute';

/**
 * List Item Variant Attribute records.
 */
export async function listItemVariantAttribute(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(itemVariantAttribute).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Item Variant Attribute by ID.
 */
export async function getItemVariantAttribute(db: any, id: string) {
  const rows = await db.select().from(itemVariantAttribute).where(eq(itemVariantAttribute.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Item Variant Attribute.
 */
export async function createItemVariantAttribute(db: any, data: unknown) {
  const parsed = ItemVariantAttributeInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(itemVariantAttribute).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Item Variant Attribute.
 */
export async function updateItemVariantAttribute(db: any, id: string, data: unknown) {
  const parsed = ItemVariantAttributeInsertSchema.partial().parse(data);
  await db.update(itemVariantAttribute).set({ ...parsed, modified: new Date() }).where(eq(itemVariantAttribute.id, id));
  return getItemVariantAttribute(db, id);
}

/**
 * Delete a Item Variant Attribute by ID.
 */
export async function deleteItemVariantAttribute(db: any, id: string) {
  await db.delete(itemVariantAttribute).where(eq(itemVariantAttribute.id, id));
  return { deleted: true, id };
}
