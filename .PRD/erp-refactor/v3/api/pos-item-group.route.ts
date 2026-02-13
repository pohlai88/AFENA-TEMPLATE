// CRUD API handlers for POS Item Group
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { posItemGroup } from '../db/schema.js';
import { PosItemGroupSchema, PosItemGroupInsertSchema } from '../types/pos-item-group.js';

export const ROUTE_PREFIX = '/pos-item-group';

/**
 * List POS Item Group records.
 */
export async function listPosItemGroup(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(posItemGroup).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single POS Item Group by ID.
 */
export async function getPosItemGroup(db: any, id: string) {
  const rows = await db.select().from(posItemGroup).where(eq(posItemGroup.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new POS Item Group.
 */
export async function createPosItemGroup(db: any, data: unknown) {
  const parsed = PosItemGroupInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(posItemGroup).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing POS Item Group.
 */
export async function updatePosItemGroup(db: any, id: string, data: unknown) {
  const parsed = PosItemGroupInsertSchema.partial().parse(data);
  await db.update(posItemGroup).set({ ...parsed, modified: new Date() }).where(eq(posItemGroup.id, id));
  return getPosItemGroup(db, id);
}

/**
 * Delete a POS Item Group by ID.
 */
export async function deletePosItemGroup(db: any, id: string) {
  await db.delete(posItemGroup).where(eq(posItemGroup.id, id));
  return { deleted: true, id };
}
