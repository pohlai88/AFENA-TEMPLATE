// CRUD API handlers for Stock Closing Balance
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { stockClosingBalance } from '../db/schema.js';
import { StockClosingBalanceSchema, StockClosingBalanceInsertSchema } from '../types/stock-closing-balance.js';

export const ROUTE_PREFIX = '/stock-closing-balance';

/**
 * List Stock Closing Balance records.
 */
export async function listStockClosingBalance(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(stockClosingBalance).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Stock Closing Balance by ID.
 */
export async function getStockClosingBalance(db: any, id: string) {
  const rows = await db.select().from(stockClosingBalance).where(eq(stockClosingBalance.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Stock Closing Balance.
 */
export async function createStockClosingBalance(db: any, data: unknown) {
  const parsed = StockClosingBalanceInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(stockClosingBalance).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Stock Closing Balance.
 */
export async function updateStockClosingBalance(db: any, id: string, data: unknown) {
  const parsed = StockClosingBalanceInsertSchema.partial().parse(data);
  await db.update(stockClosingBalance).set({ ...parsed, modified: new Date() }).where(eq(stockClosingBalance.id, id));
  return getStockClosingBalance(db, id);
}

/**
 * Delete a Stock Closing Balance by ID.
 */
export async function deleteStockClosingBalance(db: any, id: string) {
  await db.delete(stockClosingBalance).where(eq(stockClosingBalance.id, id));
  return { deleted: true, id };
}
