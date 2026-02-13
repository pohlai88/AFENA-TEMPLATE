// CRUD API handlers for Stock Ledger Entry
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { stockLedgerEntry } from '../db/schema.js';
import { StockLedgerEntrySchema, StockLedgerEntryInsertSchema } from '../types/stock-ledger-entry.js';

export const ROUTE_PREFIX = '/stock-ledger-entry';

/**
 * List Stock Ledger Entry records.
 */
export async function listStockLedgerEntry(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(stockLedgerEntry).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Stock Ledger Entry by ID.
 */
export async function getStockLedgerEntry(db: any, id: string) {
  const rows = await db.select().from(stockLedgerEntry).where(eq(stockLedgerEntry.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Stock Ledger Entry.
 */
export async function createStockLedgerEntry(db: any, data: unknown) {
  const parsed = StockLedgerEntryInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(stockLedgerEntry).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Stock Ledger Entry.
 */
export async function updateStockLedgerEntry(db: any, id: string, data: unknown) {
  const parsed = StockLedgerEntryInsertSchema.partial().parse(data);
  await db.update(stockLedgerEntry).set({ ...parsed, modified: new Date() }).where(eq(stockLedgerEntry.id, id));
  return getStockLedgerEntry(db, id);
}

/**
 * Delete a Stock Ledger Entry by ID.
 */
export async function deleteStockLedgerEntry(db: any, id: string) {
  await db.delete(stockLedgerEntry).where(eq(stockLedgerEntry.id, id));
  return { deleted: true, id };
}
