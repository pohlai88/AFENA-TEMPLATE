// CRUD API handlers for Item Price
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { itemPrice } from '../db/schema.js';
import { ItemPriceSchema, ItemPriceInsertSchema } from '../types/item-price.js';

export const ROUTE_PREFIX = '/item-price';

/**
 * List Item Price records.
 */
export async function listItemPrice(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(itemPrice).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Item Price by ID.
 */
export async function getItemPrice(db: any, id: string) {
  const rows = await db.select().from(itemPrice).where(eq(itemPrice.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Item Price.
 */
export async function createItemPrice(db: any, data: unknown) {
  const parsed = ItemPriceInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(itemPrice).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Item Price.
 */
export async function updateItemPrice(db: any, id: string, data: unknown) {
  const parsed = ItemPriceInsertSchema.partial().parse(data);
  await db.update(itemPrice).set({ ...parsed, modified: new Date() }).where(eq(itemPrice.id, id));
  return getItemPrice(db, id);
}

/**
 * Delete a Item Price by ID.
 */
export async function deleteItemPrice(db: any, id: string) {
  await db.delete(itemPrice).where(eq(itemPrice.id, id));
  return { deleted: true, id };
}
