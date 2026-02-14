// CRUD API handlers for Stock Reposting Settings
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { stockRepostingSettings } from '../db/schema.js';
import { StockRepostingSettingsSchema, StockRepostingSettingsInsertSchema } from '../types/stock-reposting-settings.js';

export const ROUTE_PREFIX = '/stock-reposting-settings';

/**
 * List Stock Reposting Settings records.
 */
export async function listStockRepostingSettings(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(stockRepostingSettings).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Stock Reposting Settings by ID.
 */
export async function getStockRepostingSettings(db: any, id: string) {
  const rows = await db.select().from(stockRepostingSettings).where(eq(stockRepostingSettings.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Stock Reposting Settings.
 */
export async function createStockRepostingSettings(db: any, data: unknown) {
  const parsed = StockRepostingSettingsInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(stockRepostingSettings).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Stock Reposting Settings.
 */
export async function updateStockRepostingSettings(db: any, id: string, data: unknown) {
  const parsed = StockRepostingSettingsInsertSchema.partial().parse(data);
  await db.update(stockRepostingSettings).set({ ...parsed, modified: new Date() }).where(eq(stockRepostingSettings.id, id));
  return getStockRepostingSettings(db, id);
}

/**
 * Delete a Stock Reposting Settings by ID.
 */
export async function deleteStockRepostingSettings(db: any, id: string) {
  await db.delete(stockRepostingSettings).where(eq(stockRepostingSettings.id, id));
  return { deleted: true, id };
}
