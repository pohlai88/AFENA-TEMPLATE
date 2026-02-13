// CRUD API handlers for Stock Closing Entry
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { stockClosingEntry } from '../db/schema.js';
import { StockClosingEntrySchema, StockClosingEntryInsertSchema } from '../types/stock-closing-entry.js';

export const ROUTE_PREFIX = '/stock-closing-entry';

/**
 * List Stock Closing Entry records.
 */
export async function listStockClosingEntry(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(stockClosingEntry).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Stock Closing Entry by ID.
 */
export async function getStockClosingEntry(db: any, id: string) {
  const rows = await db.select().from(stockClosingEntry).where(eq(stockClosingEntry.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Stock Closing Entry.
 */
export async function createStockClosingEntry(db: any, data: unknown) {
  const parsed = StockClosingEntryInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(stockClosingEntry).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Stock Closing Entry.
 */
export async function updateStockClosingEntry(db: any, id: string, data: unknown) {
  const parsed = StockClosingEntryInsertSchema.partial().parse(data);
  await db.update(stockClosingEntry).set({ ...parsed, modified: new Date() }).where(eq(stockClosingEntry.id, id));
  return getStockClosingEntry(db, id);
}

/**
 * Delete a Stock Closing Entry by ID.
 */
export async function deleteStockClosingEntry(db: any, id: string) {
  await db.delete(stockClosingEntry).where(eq(stockClosingEntry.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Stock Closing Entry (set docstatus = 1).
 */
export async function submitStockClosingEntry(db: any, id: string) {
  await db.update(stockClosingEntry).set({ docstatus: 1, modified: new Date() }).where(eq(stockClosingEntry.id, id));
  return getStockClosingEntry(db, id);
}

/**
 * Cancel a Stock Closing Entry (set docstatus = 2).
 */
export async function cancelStockClosingEntry(db: any, id: string) {
  await db.update(stockClosingEntry).set({ docstatus: 2, modified: new Date() }).where(eq(stockClosingEntry.id, id));
  return getStockClosingEntry(db, id);
}
