// CRUD API handlers for Vehicle
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { vehicle } from '../db/schema.js';
import { VehicleSchema, VehicleInsertSchema } from '../types/vehicle.js';

export const ROUTE_PREFIX = '/vehicle';

/**
 * List Vehicle records.
 */
export async function listVehicle(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(vehicle).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Vehicle by ID.
 */
export async function getVehicle(db: any, id: string) {
  const rows = await db.select().from(vehicle).where(eq(vehicle.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Vehicle.
 */
export async function createVehicle(db: any, data: unknown) {
  const parsed = VehicleInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(vehicle).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Vehicle.
 */
export async function updateVehicle(db: any, id: string, data: unknown) {
  const parsed = VehicleInsertSchema.partial().parse(data);
  await db.update(vehicle).set({ ...parsed, modified: new Date() }).where(eq(vehicle.id, id));
  return getVehicle(db, id);
}

/**
 * Delete a Vehicle by ID.
 */
export async function deleteVehicle(db: any, id: string) {
  await db.delete(vehicle).where(eq(vehicle.id, id));
  return { deleted: true, id };
}
