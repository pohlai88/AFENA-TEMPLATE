// CRUD API handlers for Item Supplier
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { itemSupplier } from '../db/schema.js';
import { ItemSupplierSchema, ItemSupplierInsertSchema } from '../types/item-supplier.js';

export const ROUTE_PREFIX = '/item-supplier';

/**
 * List Item Supplier records.
 */
export async function listItemSupplier(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(itemSupplier).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Item Supplier by ID.
 */
export async function getItemSupplier(db: any, id: string) {
  const rows = await db.select().from(itemSupplier).where(eq(itemSupplier.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Item Supplier.
 */
export async function createItemSupplier(db: any, data: unknown) {
  const parsed = ItemSupplierInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(itemSupplier).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Item Supplier.
 */
export async function updateItemSupplier(db: any, id: string, data: unknown) {
  const parsed = ItemSupplierInsertSchema.partial().parse(data);
  await db.update(itemSupplier).set({ ...parsed, modified: new Date() }).where(eq(itemSupplier.id, id));
  return getItemSupplier(db, id);
}

/**
 * Delete a Item Supplier by ID.
 */
export async function deleteItemSupplier(db: any, id: string) {
  await db.delete(itemSupplier).where(eq(itemSupplier.id, id));
  return { deleted: true, id };
}
