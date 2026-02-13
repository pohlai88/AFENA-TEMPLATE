// CRUD API handlers for Stock Entry Type
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { stockEntryType } from '../db/schema.js';
import { StockEntryTypeSchema, StockEntryTypeInsertSchema } from '../types/stock-entry-type.js';

export const ROUTE_PREFIX = '/stock-entry-type';

/**
 * List Stock Entry Type records.
 */
export async function listStockEntryType(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(stockEntryType).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Stock Entry Type by ID.
 */
export async function getStockEntryType(db: any, id: string) {
  const rows = await db.select().from(stockEntryType).where(eq(stockEntryType.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Stock Entry Type.
 */
export async function createStockEntryType(db: any, data: unknown) {
  const parsed = StockEntryTypeInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(stockEntryType).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Stock Entry Type.
 */
export async function updateStockEntryType(db: any, id: string, data: unknown) {
  const parsed = StockEntryTypeInsertSchema.partial().parse(data);
  await db.update(stockEntryType).set({ ...parsed, modified: new Date() }).where(eq(stockEntryType.id, id));
  return getStockEntryType(db, id);
}

/**
 * Delete a Stock Entry Type by ID.
 */
export async function deleteStockEntryType(db: any, id: string) {
  await db.delete(stockEntryType).where(eq(stockEntryType.id, id));
  return { deleted: true, id };
}
