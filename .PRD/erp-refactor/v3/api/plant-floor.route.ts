// CRUD API handlers for Plant Floor
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { plantFloor } from '../db/schema.js';
import { PlantFloorSchema, PlantFloorInsertSchema } from '../types/plant-floor.js';

export const ROUTE_PREFIX = '/plant-floor';

/**
 * List Plant Floor records.
 */
export async function listPlantFloor(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(plantFloor).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Plant Floor by ID.
 */
export async function getPlantFloor(db: any, id: string) {
  const rows = await db.select().from(plantFloor).where(eq(plantFloor.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Plant Floor.
 */
export async function createPlantFloor(db: any, data: unknown) {
  const parsed = PlantFloorInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(plantFloor).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Plant Floor.
 */
export async function updatePlantFloor(db: any, id: string, data: unknown) {
  const parsed = PlantFloorInsertSchema.partial().parse(data);
  await db.update(plantFloor).set({ ...parsed, modified: new Date() }).where(eq(plantFloor.id, id));
  return getPlantFloor(db, id);
}

/**
 * Delete a Plant Floor by ID.
 */
export async function deletePlantFloor(db: any, id: string) {
  await db.delete(plantFloor).where(eq(plantFloor.id, id));
  return { deleted: true, id };
}
