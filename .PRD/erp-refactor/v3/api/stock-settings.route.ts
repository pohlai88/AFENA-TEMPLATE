// CRUD API handlers for Stock Settings
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { stockSettings } from '../db/schema.js';
import { StockSettingsSchema, StockSettingsInsertSchema } from '../types/stock-settings.js';

export const ROUTE_PREFIX = '/stock-settings';

/**
 * List Stock Settings records.
 */
export async function listStockSettings(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(stockSettings).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Stock Settings by ID.
 */
export async function getStockSettings(db: any, id: string) {
  const rows = await db.select().from(stockSettings).where(eq(stockSettings.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Stock Settings.
 */
export async function createStockSettings(db: any, data: unknown) {
  const parsed = StockSettingsInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(stockSettings).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Stock Settings.
 */
export async function updateStockSettings(db: any, id: string, data: unknown) {
  const parsed = StockSettingsInsertSchema.partial().parse(data);
  await db.update(stockSettings).set({ ...parsed, modified: new Date() }).where(eq(stockSettings.id, id));
  return getStockSettings(db, id);
}

/**
 * Delete a Stock Settings by ID.
 */
export async function deleteStockSettings(db: any, id: string) {
  await db.delete(stockSettings).where(eq(stockSettings.id, id));
  return { deleted: true, id };
}
