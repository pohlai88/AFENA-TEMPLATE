// CRUD API handlers for Stock Entry
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { stockEntry } from '../db/schema.js';
import { StockEntrySchema, StockEntryInsertSchema } from '../types/stock-entry.js';

export const ROUTE_PREFIX = '/stock-entry';

/**
 * List Stock Entry records.
 */
export async function listStockEntry(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(stockEntry).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Stock Entry by ID.
 */
export async function getStockEntry(db: any, id: string) {
  const rows = await db.select().from(stockEntry).where(eq(stockEntry.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Stock Entry.
 */
export async function createStockEntry(db: any, data: unknown) {
  const parsed = StockEntryInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(stockEntry).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Stock Entry.
 */
export async function updateStockEntry(db: any, id: string, data: unknown) {
  const parsed = StockEntryInsertSchema.partial().parse(data);
  await db.update(stockEntry).set({ ...parsed, modified: new Date() }).where(eq(stockEntry.id, id));
  return getStockEntry(db, id);
}

/**
 * Delete a Stock Entry by ID.
 */
export async function deleteStockEntry(db: any, id: string) {
  await db.delete(stockEntry).where(eq(stockEntry.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Stock Entry (set docstatus = 1).
 */
export async function submitStockEntry(db: any, id: string) {
  await db.update(stockEntry).set({ docstatus: 1, modified: new Date() }).where(eq(stockEntry.id, id));
  return getStockEntry(db, id);
}

/**
 * Cancel a Stock Entry (set docstatus = 2).
 */
export async function cancelStockEntry(db: any, id: string) {
  await db.update(stockEntry).set({ docstatus: 2, modified: new Date() }).where(eq(stockEntry.id, id));
  return getStockEntry(db, id);
}
