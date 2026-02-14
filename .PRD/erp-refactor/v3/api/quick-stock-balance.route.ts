// CRUD API handlers for Quick Stock Balance
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { quickStockBalance } from '../db/schema.js';
import { QuickStockBalanceSchema, QuickStockBalanceInsertSchema } from '../types/quick-stock-balance.js';

export const ROUTE_PREFIX = '/quick-stock-balance';

/**
 * List Quick Stock Balance records.
 */
export async function listQuickStockBalance(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(quickStockBalance).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Quick Stock Balance by ID.
 */
export async function getQuickStockBalance(db: any, id: string) {
  const rows = await db.select().from(quickStockBalance).where(eq(quickStockBalance.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Quick Stock Balance.
 */
export async function createQuickStockBalance(db: any, data: unknown) {
  const parsed = QuickStockBalanceInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(quickStockBalance).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Quick Stock Balance.
 */
export async function updateQuickStockBalance(db: any, id: string, data: unknown) {
  const parsed = QuickStockBalanceInsertSchema.partial().parse(data);
  await db.update(quickStockBalance).set({ ...parsed, modified: new Date() }).where(eq(quickStockBalance.id, id));
  return getQuickStockBalance(db, id);
}

/**
 * Delete a Quick Stock Balance by ID.
 */
export async function deleteQuickStockBalance(db: any, id: string) {
  await db.delete(quickStockBalance).where(eq(quickStockBalance.id, id));
  return { deleted: true, id };
}
