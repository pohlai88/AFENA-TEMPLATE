// CRUD API handlers for Item Barcode
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { itemBarcode } from '../db/schema.js';
import { ItemBarcodeSchema, ItemBarcodeInsertSchema } from '../types/item-barcode.js';

export const ROUTE_PREFIX = '/item-barcode';

/**
 * List Item Barcode records.
 */
export async function listItemBarcode(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(itemBarcode).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Item Barcode by ID.
 */
export async function getItemBarcode(db: any, id: string) {
  const rows = await db.select().from(itemBarcode).where(eq(itemBarcode.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Item Barcode.
 */
export async function createItemBarcode(db: any, data: unknown) {
  const parsed = ItemBarcodeInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(itemBarcode).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Item Barcode.
 */
export async function updateItemBarcode(db: any, id: string, data: unknown) {
  const parsed = ItemBarcodeInsertSchema.partial().parse(data);
  await db.update(itemBarcode).set({ ...parsed, modified: new Date() }).where(eq(itemBarcode.id, id));
  return getItemBarcode(db, id);
}

/**
 * Delete a Item Barcode by ID.
 */
export async function deleteItemBarcode(db: any, id: string) {
  await db.delete(itemBarcode).where(eq(itemBarcode.id, id));
  return { deleted: true, id };
}
