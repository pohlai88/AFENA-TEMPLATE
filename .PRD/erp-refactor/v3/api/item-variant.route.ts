// CRUD API handlers for Item Variant
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { itemVariant } from '../db/schema.js';
import { ItemVariantSchema, ItemVariantInsertSchema } from '../types/item-variant.js';

export const ROUTE_PREFIX = '/item-variant';

/**
 * List Item Variant records.
 */
export async function listItemVariant(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(itemVariant).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Item Variant by ID.
 */
export async function getItemVariant(db: any, id: string) {
  const rows = await db.select().from(itemVariant).where(eq(itemVariant.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Item Variant.
 */
export async function createItemVariant(db: any, data: unknown) {
  const parsed = ItemVariantInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(itemVariant).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Item Variant.
 */
export async function updateItemVariant(db: any, id: string, data: unknown) {
  const parsed = ItemVariantInsertSchema.partial().parse(data);
  await db.update(itemVariant).set({ ...parsed, modified: new Date() }).where(eq(itemVariant.id, id));
  return getItemVariant(db, id);
}

/**
 * Delete a Item Variant by ID.
 */
export async function deleteItemVariant(db: any, id: string) {
  await db.delete(itemVariant).where(eq(itemVariant.id, id));
  return { deleted: true, id };
}
