// CRUD API handlers for Stock Reservation Entry
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { stockReservationEntry } from '../db/schema.js';
import { StockReservationEntrySchema, StockReservationEntryInsertSchema } from '../types/stock-reservation-entry.js';

export const ROUTE_PREFIX = '/stock-reservation-entry';

/**
 * List Stock Reservation Entry records.
 */
export async function listStockReservationEntry(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(stockReservationEntry).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Stock Reservation Entry by ID.
 */
export async function getStockReservationEntry(db: any, id: string) {
  const rows = await db.select().from(stockReservationEntry).where(eq(stockReservationEntry.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Stock Reservation Entry.
 */
export async function createStockReservationEntry(db: any, data: unknown) {
  const parsed = StockReservationEntryInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(stockReservationEntry).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Stock Reservation Entry.
 */
export async function updateStockReservationEntry(db: any, id: string, data: unknown) {
  const parsed = StockReservationEntryInsertSchema.partial().parse(data);
  await db.update(stockReservationEntry).set({ ...parsed, modified: new Date() }).where(eq(stockReservationEntry.id, id));
  return getStockReservationEntry(db, id);
}

/**
 * Delete a Stock Reservation Entry by ID.
 */
export async function deleteStockReservationEntry(db: any, id: string) {
  await db.delete(stockReservationEntry).where(eq(stockReservationEntry.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Stock Reservation Entry (set docstatus = 1).
 */
export async function submitStockReservationEntry(db: any, id: string) {
  await db.update(stockReservationEntry).set({ docstatus: 1, modified: new Date() }).where(eq(stockReservationEntry.id, id));
  return getStockReservationEntry(db, id);
}

/**
 * Cancel a Stock Reservation Entry (set docstatus = 2).
 */
export async function cancelStockReservationEntry(db: any, id: string) {
  await db.update(stockReservationEntry).set({ docstatus: 2, modified: new Date() }).where(eq(stockReservationEntry.id, id));
  return getStockReservationEntry(db, id);
}
