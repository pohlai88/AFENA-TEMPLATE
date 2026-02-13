// CRUD API handlers for Warehouse Type
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { warehouseType } from '../db/schema.js';
import { WarehouseTypeSchema, WarehouseTypeInsertSchema } from '../types/warehouse-type.js';

export const ROUTE_PREFIX = '/warehouse-type';

/**
 * List Warehouse Type records.
 */
export async function listWarehouseType(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(warehouseType).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Warehouse Type by ID.
 */
export async function getWarehouseType(db: any, id: string) {
  const rows = await db.select().from(warehouseType).where(eq(warehouseType.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Warehouse Type.
 */
export async function createWarehouseType(db: any, data: unknown) {
  const parsed = WarehouseTypeInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(warehouseType).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Warehouse Type.
 */
export async function updateWarehouseType(db: any, id: string, data: unknown) {
  const parsed = WarehouseTypeInsertSchema.partial().parse(data);
  await db.update(warehouseType).set({ ...parsed, modified: new Date() }).where(eq(warehouseType.id, id));
  return getWarehouseType(db, id);
}

/**
 * Delete a Warehouse Type by ID.
 */
export async function deleteWarehouseType(db: any, id: string) {
  await db.delete(warehouseType).where(eq(warehouseType.id, id));
  return { deleted: true, id };
}
