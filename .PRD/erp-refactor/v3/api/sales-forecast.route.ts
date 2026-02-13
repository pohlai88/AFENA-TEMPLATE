// CRUD API handlers for Sales Forecast
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { salesForecast } from '../db/schema.js';
import { SalesForecastSchema, SalesForecastInsertSchema } from '../types/sales-forecast.js';

export const ROUTE_PREFIX = '/sales-forecast';

/**
 * List Sales Forecast records.
 */
export async function listSalesForecast(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(salesForecast).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Sales Forecast by ID.
 */
export async function getSalesForecast(db: any, id: string) {
  const rows = await db.select().from(salesForecast).where(eq(salesForecast.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Sales Forecast.
 */
export async function createSalesForecast(db: any, data: unknown) {
  const parsed = SalesForecastInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(salesForecast).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Sales Forecast.
 */
export async function updateSalesForecast(db: any, id: string, data: unknown) {
  const parsed = SalesForecastInsertSchema.partial().parse(data);
  await db.update(salesForecast).set({ ...parsed, modified: new Date() }).where(eq(salesForecast.id, id));
  return getSalesForecast(db, id);
}

/**
 * Delete a Sales Forecast by ID.
 */
export async function deleteSalesForecast(db: any, id: string) {
  await db.delete(salesForecast).where(eq(salesForecast.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Sales Forecast (set docstatus = 1).
 */
export async function submitSalesForecast(db: any, id: string) {
  await db.update(salesForecast).set({ docstatus: 1, modified: new Date() }).where(eq(salesForecast.id, id));
  return getSalesForecast(db, id);
}

/**
 * Cancel a Sales Forecast (set docstatus = 2).
 */
export async function cancelSalesForecast(db: any, id: string) {
  await db.update(salesForecast).set({ docstatus: 2, modified: new Date() }).where(eq(salesForecast.id, id));
  return getSalesForecast(db, id);
}
