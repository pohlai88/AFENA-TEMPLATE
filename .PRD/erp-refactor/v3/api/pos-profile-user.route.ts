// CRUD API handlers for POS Profile User
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { posProfileUser } from '../db/schema.js';
import { PosProfileUserSchema, PosProfileUserInsertSchema } from '../types/pos-profile-user.js';

export const ROUTE_PREFIX = '/pos-profile-user';

/**
 * List POS Profile User records.
 */
export async function listPosProfileUser(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(posProfileUser).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single POS Profile User by ID.
 */
export async function getPosProfileUser(db: any, id: string) {
  const rows = await db.select().from(posProfileUser).where(eq(posProfileUser.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new POS Profile User.
 */
export async function createPosProfileUser(db: any, data: unknown) {
  const parsed = PosProfileUserInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(posProfileUser).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing POS Profile User.
 */
export async function updatePosProfileUser(db: any, id: string, data: unknown) {
  const parsed = PosProfileUserInsertSchema.partial().parse(data);
  await db.update(posProfileUser).set({ ...parsed, modified: new Date() }).where(eq(posProfileUser.id, id));
  return getPosProfileUser(db, id);
}

/**
 * Delete a POS Profile User by ID.
 */
export async function deletePosProfileUser(db: any, id: string) {
  await db.delete(posProfileUser).where(eq(posProfileUser.id, id));
  return { deleted: true, id };
}
