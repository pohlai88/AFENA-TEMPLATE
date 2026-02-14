// CRUD API handlers for Item Manufacturer
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { itemManufacturer } from '../db/schema.js';
import { ItemManufacturerSchema, ItemManufacturerInsertSchema } from '../types/item-manufacturer.js';

export const ROUTE_PREFIX = '/item-manufacturer';

/**
 * List Item Manufacturer records.
 */
export async function listItemManufacturer(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(itemManufacturer).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Item Manufacturer by ID.
 */
export async function getItemManufacturer(db: any, id: string) {
  const rows = await db.select().from(itemManufacturer).where(eq(itemManufacturer.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Item Manufacturer.
 */
export async function createItemManufacturer(db: any, data: unknown) {
  const parsed = ItemManufacturerInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(itemManufacturer).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Item Manufacturer.
 */
export async function updateItemManufacturer(db: any, id: string, data: unknown) {
  const parsed = ItemManufacturerInsertSchema.partial().parse(data);
  await db.update(itemManufacturer).set({ ...parsed, modified: new Date() }).where(eq(itemManufacturer.id, id));
  return getItemManufacturer(db, id);
}

/**
 * Delete a Item Manufacturer by ID.
 */
export async function deleteItemManufacturer(db: any, id: string) {
  await db.delete(itemManufacturer).where(eq(itemManufacturer.id, id));
  return { deleted: true, id };
}
