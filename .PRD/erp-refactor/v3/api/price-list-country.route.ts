// CRUD API handlers for Price List Country
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { priceListCountry } from '../db/schema.js';
import { PriceListCountrySchema, PriceListCountryInsertSchema } from '../types/price-list-country.js';

export const ROUTE_PREFIX = '/price-list-country';

/**
 * List Price List Country records.
 */
export async function listPriceListCountry(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(priceListCountry).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Price List Country by ID.
 */
export async function getPriceListCountry(db: any, id: string) {
  const rows = await db.select().from(priceListCountry).where(eq(priceListCountry.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Price List Country.
 */
export async function createPriceListCountry(db: any, data: unknown) {
  const parsed = PriceListCountryInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(priceListCountry).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Price List Country.
 */
export async function updatePriceListCountry(db: any, id: string, data: unknown) {
  const parsed = PriceListCountryInsertSchema.partial().parse(data);
  await db.update(priceListCountry).set({ ...parsed, modified: new Date() }).where(eq(priceListCountry.id, id));
  return getPriceListCountry(db, id);
}

/**
 * Delete a Price List Country by ID.
 */
export async function deletePriceListCountry(db: any, id: string) {
  await db.delete(priceListCountry).where(eq(priceListCountry.id, id));
  return { deleted: true, id };
}
