// CRUD API handlers for POS Profile
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { posProfile } from '../db/schema.js';
import { PosProfileSchema, PosProfileInsertSchema } from '../types/pos-profile.js';

export const ROUTE_PREFIX = '/pos-profile';

/**
 * List POS Profile records.
 */
export async function listPosProfile(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(posProfile).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single POS Profile by ID.
 */
export async function getPosProfile(db: any, id: string) {
  const rows = await db.select().from(posProfile).where(eq(posProfile.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new POS Profile.
 */
export async function createPosProfile(db: any, data: unknown) {
  const parsed = PosProfileInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(posProfile).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing POS Profile.
 */
export async function updatePosProfile(db: any, id: string, data: unknown) {
  const parsed = PosProfileInsertSchema.partial().parse(data);
  await db.update(posProfile).set({ ...parsed, modified: new Date() }).where(eq(posProfile.id, id));
  return getPosProfile(db, id);
}

/**
 * Delete a POS Profile by ID.
 */
export async function deletePosProfile(db: any, id: string) {
  await db.delete(posProfile).where(eq(posProfile.id, id));
  return { deleted: true, id };
}
