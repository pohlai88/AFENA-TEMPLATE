// CRUD API handlers for Stock Entry Detail
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { stockEntryDetail } from '../db/schema.js';
import { StockEntryDetailSchema, StockEntryDetailInsertSchema } from '../types/stock-entry-detail.js';

export const ROUTE_PREFIX = '/stock-entry-detail';

/**
 * List Stock Entry Detail records.
 */
export async function listStockEntryDetail(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(stockEntryDetail).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Stock Entry Detail by ID.
 */
export async function getStockEntryDetail(db: any, id: string) {
  const rows = await db.select().from(stockEntryDetail).where(eq(stockEntryDetail.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Stock Entry Detail.
 */
export async function createStockEntryDetail(db: any, data: unknown) {
  const parsed = StockEntryDetailInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(stockEntryDetail).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Stock Entry Detail.
 */
export async function updateStockEntryDetail(db: any, id: string, data: unknown) {
  const parsed = StockEntryDetailInsertSchema.partial().parse(data);
  await db.update(stockEntryDetail).set({ ...parsed, modified: new Date() }).where(eq(stockEntryDetail.id, id));
  return getStockEntryDetail(db, id);
}

/**
 * Delete a Stock Entry Detail by ID.
 */
export async function deleteStockEntryDetail(db: any, id: string) {
  await db.delete(stockEntryDetail).where(eq(stockEntryDetail.id, id));
  return { deleted: true, id };
}
