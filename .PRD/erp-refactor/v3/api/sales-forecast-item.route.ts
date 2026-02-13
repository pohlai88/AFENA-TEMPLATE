// CRUD API handlers for Sales Forecast Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { salesForecastItem } from '../db/schema.js';
import { SalesForecastItemSchema, SalesForecastItemInsertSchema } from '../types/sales-forecast-item.js';

export const ROUTE_PREFIX = '/sales-forecast-item';

/**
 * List Sales Forecast Item records.
 */
export async function listSalesForecastItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(salesForecastItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Sales Forecast Item by ID.
 */
export async function getSalesForecastItem(db: any, id: string) {
  const rows = await db.select().from(salesForecastItem).where(eq(salesForecastItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Sales Forecast Item.
 */
export async function createSalesForecastItem(db: any, data: unknown) {
  const parsed = SalesForecastItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(salesForecastItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Sales Forecast Item.
 */
export async function updateSalesForecastItem(db: any, id: string, data: unknown) {
  const parsed = SalesForecastItemInsertSchema.partial().parse(data);
  await db.update(salesForecastItem).set({ ...parsed, modified: new Date() }).where(eq(salesForecastItem.id, id));
  return getSalesForecastItem(db, id);
}

/**
 * Delete a Sales Forecast Item by ID.
 */
export async function deleteSalesForecastItem(db: any, id: string) {
  await db.delete(salesForecastItem).where(eq(salesForecastItem.id, id));
  return { deleted: true, id };
}
