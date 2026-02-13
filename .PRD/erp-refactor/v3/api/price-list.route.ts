// CRUD API handlers for Price List
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { priceList } from '../db/schema.js';
import { PriceListSchema, PriceListInsertSchema } from '../types/price-list.js';

export const ROUTE_PREFIX = '/price-list';

/**
 * List Price List records.
 */
export async function listPriceList(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(priceList).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Price List by ID.
 */
export async function getPriceList(db: any, id: string) {
  const rows = await db.select().from(priceList).where(eq(priceList.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Price List.
 */
export async function createPriceList(db: any, data: unknown) {
  const parsed = PriceListInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(priceList).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Price List.
 */
export async function updatePriceList(db: any, id: string, data: unknown) {
  const parsed = PriceListInsertSchema.partial().parse(data);
  await db.update(priceList).set({ ...parsed, modified: new Date() }).where(eq(priceList.id, id));
  return getPriceList(db, id);
}

/**
 * Delete a Price List by ID.
 */
export async function deletePriceList(db: any, id: string) {
  await db.delete(priceList).where(eq(priceList.id, id));
  return { deleted: true, id };
}
