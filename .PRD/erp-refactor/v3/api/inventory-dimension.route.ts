// CRUD API handlers for Inventory Dimension
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { inventoryDimension } from '../db/schema.js';
import { InventoryDimensionSchema, InventoryDimensionInsertSchema } from '../types/inventory-dimension.js';

export const ROUTE_PREFIX = '/inventory-dimension';

/**
 * List Inventory Dimension records.
 */
export async function listInventoryDimension(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(inventoryDimension).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Inventory Dimension by ID.
 */
export async function getInventoryDimension(db: any, id: string) {
  const rows = await db.select().from(inventoryDimension).where(eq(inventoryDimension.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Inventory Dimension.
 */
export async function createInventoryDimension(db: any, data: unknown) {
  const parsed = InventoryDimensionInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(inventoryDimension).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Inventory Dimension.
 */
export async function updateInventoryDimension(db: any, id: string, data: unknown) {
  const parsed = InventoryDimensionInsertSchema.partial().parse(data);
  await db.update(inventoryDimension).set({ ...parsed, modified: new Date() }).where(eq(inventoryDimension.id, id));
  return getInventoryDimension(db, id);
}

/**
 * Delete a Inventory Dimension by ID.
 */
export async function deleteInventoryDimension(db: any, id: string) {
  await db.delete(inventoryDimension).where(eq(inventoryDimension.id, id));
  return { deleted: true, id };
}
