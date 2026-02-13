// CRUD API handlers for Stock Reconciliation Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { stockReconciliationItem } from '../db/schema.js';
import { StockReconciliationItemSchema, StockReconciliationItemInsertSchema } from '../types/stock-reconciliation-item.js';

export const ROUTE_PREFIX = '/stock-reconciliation-item';

/**
 * List Stock Reconciliation Item records.
 */
export async function listStockReconciliationItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(stockReconciliationItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Stock Reconciliation Item by ID.
 */
export async function getStockReconciliationItem(db: any, id: string) {
  const rows = await db.select().from(stockReconciliationItem).where(eq(stockReconciliationItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Stock Reconciliation Item.
 */
export async function createStockReconciliationItem(db: any, data: unknown) {
  const parsed = StockReconciliationItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(stockReconciliationItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Stock Reconciliation Item.
 */
export async function updateStockReconciliationItem(db: any, id: string, data: unknown) {
  const parsed = StockReconciliationItemInsertSchema.partial().parse(data);
  await db.update(stockReconciliationItem).set({ ...parsed, modified: new Date() }).where(eq(stockReconciliationItem.id, id));
  return getStockReconciliationItem(db, id);
}

/**
 * Delete a Stock Reconciliation Item by ID.
 */
export async function deleteStockReconciliationItem(db: any, id: string) {
  await db.delete(stockReconciliationItem).where(eq(stockReconciliationItem.id, id));
  return { deleted: true, id };
}
