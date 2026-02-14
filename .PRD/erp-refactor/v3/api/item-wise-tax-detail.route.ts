// CRUD API handlers for Item Wise Tax Detail
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { itemWiseTaxDetail } from '../db/schema.js';
import { ItemWiseTaxDetailSchema, ItemWiseTaxDetailInsertSchema } from '../types/item-wise-tax-detail.js';

export const ROUTE_PREFIX = '/item-wise-tax-detail';

/**
 * List Item Wise Tax Detail records.
 */
export async function listItemWiseTaxDetail(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(itemWiseTaxDetail).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Item Wise Tax Detail by ID.
 */
export async function getItemWiseTaxDetail(db: any, id: string) {
  const rows = await db.select().from(itemWiseTaxDetail).where(eq(itemWiseTaxDetail.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Item Wise Tax Detail.
 */
export async function createItemWiseTaxDetail(db: any, data: unknown) {
  const parsed = ItemWiseTaxDetailInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(itemWiseTaxDetail).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Item Wise Tax Detail.
 */
export async function updateItemWiseTaxDetail(db: any, id: string, data: unknown) {
  const parsed = ItemWiseTaxDetailInsertSchema.partial().parse(data);
  await db.update(itemWiseTaxDetail).set({ ...parsed, modified: new Date() }).where(eq(itemWiseTaxDetail.id, id));
  return getItemWiseTaxDetail(db, id);
}

/**
 * Delete a Item Wise Tax Detail by ID.
 */
export async function deleteItemWiseTaxDetail(db: any, id: string) {
  await db.delete(itemWiseTaxDetail).where(eq(itemWiseTaxDetail.id, id));
  return { deleted: true, id };
}
