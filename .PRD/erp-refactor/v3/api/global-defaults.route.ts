// CRUD API handlers for Global Defaults
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { globalDefaults } from '../db/schema.js';
import { GlobalDefaultsSchema, GlobalDefaultsInsertSchema } from '../types/global-defaults.js';

export const ROUTE_PREFIX = '/global-defaults';

/**
 * List Global Defaults records.
 */
export async function listGlobalDefaults(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(globalDefaults).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Global Defaults by ID.
 */
export async function getGlobalDefaults(db: any, id: string) {
  const rows = await db.select().from(globalDefaults).where(eq(globalDefaults.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Global Defaults.
 */
export async function createGlobalDefaults(db: any, data: unknown) {
  const parsed = GlobalDefaultsInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(globalDefaults).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Global Defaults.
 */
export async function updateGlobalDefaults(db: any, id: string, data: unknown) {
  const parsed = GlobalDefaultsInsertSchema.partial().parse(data);
  await db.update(globalDefaults).set({ ...parsed, modified: new Date() }).where(eq(globalDefaults.id, id));
  return getGlobalDefaults(db, id);
}

/**
 * Delete a Global Defaults by ID.
 */
export async function deleteGlobalDefaults(db: any, id: string) {
  await db.delete(globalDefaults).where(eq(globalDefaults.id, id));
  return { deleted: true, id };
}
