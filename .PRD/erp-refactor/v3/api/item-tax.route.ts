// CRUD API handlers for Item Tax
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { itemTax } from '../db/schema.js';
import { ItemTaxSchema, ItemTaxInsertSchema } from '../types/item-tax.js';

export const ROUTE_PREFIX = '/item-tax';

/**
 * List Item Tax records.
 */
export async function listItemTax(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(itemTax).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Item Tax by ID.
 */
export async function getItemTax(db: any, id: string) {
  const rows = await db.select().from(itemTax).where(eq(itemTax.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Item Tax.
 */
export async function createItemTax(db: any, data: unknown) {
  const parsed = ItemTaxInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(itemTax).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Item Tax.
 */
export async function updateItemTax(db: any, id: string, data: unknown) {
  const parsed = ItemTaxInsertSchema.partial().parse(data);
  await db.update(itemTax).set({ ...parsed, modified: new Date() }).where(eq(itemTax.id, id));
  return getItemTax(db, id);
}

/**
 * Delete a Item Tax by ID.
 */
export async function deleteItemTax(db: any, id: string) {
  await db.delete(itemTax).where(eq(itemTax.id, id));
  return { deleted: true, id };
}
