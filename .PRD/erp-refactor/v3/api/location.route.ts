// CRUD API handlers for Location
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { location } from '../db/schema.js';
import { LocationSchema, LocationInsertSchema } from '../types/location.js';

export const ROUTE_PREFIX = '/location';

/**
 * List Location records.
 */
export async function listLocation(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(location).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Location by ID.
 */
export async function getLocation(db: any, id: string) {
  const rows = await db.select().from(location).where(eq(location.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Location.
 */
export async function createLocation(db: any, data: unknown) {
  const parsed = LocationInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(location).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Location.
 */
export async function updateLocation(db: any, id: string, data: unknown) {
  const parsed = LocationInsertSchema.partial().parse(data);
  await db.update(location).set({ ...parsed, modified: new Date() }).where(eq(location.id, id));
  return getLocation(db, id);
}

/**
 * Delete a Location by ID.
 */
export async function deleteLocation(db: any, id: string) {
  await db.delete(location).where(eq(location.id, id));
  return { deleted: true, id };
}
