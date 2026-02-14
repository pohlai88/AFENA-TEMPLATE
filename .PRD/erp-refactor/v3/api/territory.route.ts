// CRUD API handlers for Territory
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { territory } from '../db/schema.js';
import { TerritorySchema, TerritoryInsertSchema } from '../types/territory.js';

export const ROUTE_PREFIX = '/territory';

/**
 * List Territory records.
 */
export async function listTerritory(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(territory).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Territory by ID.
 */
export async function getTerritory(db: any, id: string) {
  const rows = await db.select().from(territory).where(eq(territory.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Territory.
 */
export async function createTerritory(db: any, data: unknown) {
  const parsed = TerritoryInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(territory).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Territory.
 */
export async function updateTerritory(db: any, id: string, data: unknown) {
  const parsed = TerritoryInsertSchema.partial().parse(data);
  await db.update(territory).set({ ...parsed, modified: new Date() }).where(eq(territory.id, id));
  return getTerritory(db, id);
}

/**
 * Delete a Territory by ID.
 */
export async function deleteTerritory(db: any, id: string) {
  await db.delete(territory).where(eq(territory.id, id));
  return { deleted: true, id };
}
