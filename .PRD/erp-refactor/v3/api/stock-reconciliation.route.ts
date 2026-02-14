// CRUD API handlers for Stock Reconciliation
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { stockReconciliation } from '../db/schema.js';
import { StockReconciliationSchema, StockReconciliationInsertSchema } from '../types/stock-reconciliation.js';

export const ROUTE_PREFIX = '/stock-reconciliation';

/**
 * List Stock Reconciliation records.
 */
export async function listStockReconciliation(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(stockReconciliation).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Stock Reconciliation by ID.
 */
export async function getStockReconciliation(db: any, id: string) {
  const rows = await db.select().from(stockReconciliation).where(eq(stockReconciliation.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Stock Reconciliation.
 */
export async function createStockReconciliation(db: any, data: unknown) {
  const parsed = StockReconciliationInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(stockReconciliation).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Stock Reconciliation.
 */
export async function updateStockReconciliation(db: any, id: string, data: unknown) {
  const parsed = StockReconciliationInsertSchema.partial().parse(data);
  await db.update(stockReconciliation).set({ ...parsed, modified: new Date() }).where(eq(stockReconciliation.id, id));
  return getStockReconciliation(db, id);
}

/**
 * Delete a Stock Reconciliation by ID.
 */
export async function deleteStockReconciliation(db: any, id: string) {
  await db.delete(stockReconciliation).where(eq(stockReconciliation.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Stock Reconciliation (set docstatus = 1).
 */
export async function submitStockReconciliation(db: any, id: string) {
  await db.update(stockReconciliation).set({ docstatus: 1, modified: new Date() }).where(eq(stockReconciliation.id, id));
  return getStockReconciliation(db, id);
}

/**
 * Cancel a Stock Reconciliation (set docstatus = 2).
 */
export async function cancelStockReconciliation(db: any, id: string) {
  await db.update(stockReconciliation).set({ docstatus: 2, modified: new Date() }).where(eq(stockReconciliation.id, id));
  return getStockReconciliation(db, id);
}
