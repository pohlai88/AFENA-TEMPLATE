// CRUD API handlers for Warehouse
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { warehouse } from '../db/schema.js';
import { WarehouseSchema, WarehouseInsertSchema } from '../types/warehouse.js';

export const ROUTE_PREFIX = '/warehouse';

/**
 * List Warehouse records.
 */
export async function listWarehouse(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(warehouse).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Warehouse by ID.
 */
export async function getWarehouse(db: any, id: string) {
  const rows = await db.select().from(warehouse).where(eq(warehouse.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Warehouse.
 */
export async function createWarehouse(db: any, data: unknown) {
  const parsed = WarehouseInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(warehouse).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Warehouse.
 */
export async function updateWarehouse(db: any, id: string, data: unknown) {
  const parsed = WarehouseInsertSchema.partial().parse(data);
  await db.update(warehouse).set({ ...parsed, modified: new Date() }).where(eq(warehouse.id, id));
  return getWarehouse(db, id);
}

/**
 * Delete a Warehouse by ID.
 */
export async function deleteWarehouse(db: any, id: string) {
  await db.delete(warehouse).where(eq(warehouse.id, id));
  return { deleted: true, id };
}
