// CRUD API handlers for Manufacturer
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { manufacturer } from '../db/schema.js';
import { ManufacturerSchema, ManufacturerInsertSchema } from '../types/manufacturer.js';

export const ROUTE_PREFIX = '/manufacturer';

/**
 * List Manufacturer records.
 */
export async function listManufacturer(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(manufacturer).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Manufacturer by ID.
 */
export async function getManufacturer(db: any, id: string) {
  const rows = await db.select().from(manufacturer).where(eq(manufacturer.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Manufacturer.
 */
export async function createManufacturer(db: any, data: unknown) {
  const parsed = ManufacturerInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(manufacturer).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Manufacturer.
 */
export async function updateManufacturer(db: any, id: string, data: unknown) {
  const parsed = ManufacturerInsertSchema.partial().parse(data);
  await db.update(manufacturer).set({ ...parsed, modified: new Date() }).where(eq(manufacturer.id, id));
  return getManufacturer(db, id);
}

/**
 * Delete a Manufacturer by ID.
 */
export async function deleteManufacturer(db: any, id: string) {
  await db.delete(manufacturer).where(eq(manufacturer.id, id));
  return { deleted: true, id };
}
