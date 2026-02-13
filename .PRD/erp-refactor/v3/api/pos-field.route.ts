// CRUD API handlers for POS Field
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { posField } from '../db/schema.js';
import { PosFieldSchema, PosFieldInsertSchema } from '../types/pos-field.js';

export const ROUTE_PREFIX = '/pos-field';

/**
 * List POS Field records.
 */
export async function listPosField(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(posField).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single POS Field by ID.
 */
export async function getPosField(db: any, id: string) {
  const rows = await db.select().from(posField).where(eq(posField.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new POS Field.
 */
export async function createPosField(db: any, data: unknown) {
  const parsed = PosFieldInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(posField).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing POS Field.
 */
export async function updatePosField(db: any, id: string, data: unknown) {
  const parsed = PosFieldInsertSchema.partial().parse(data);
  await db.update(posField).set({ ...parsed, modified: new Date() }).where(eq(posField.id, id));
  return getPosField(db, id);
}

/**
 * Delete a POS Field by ID.
 */
export async function deletePosField(db: any, id: string) {
  await db.delete(posField).where(eq(posField.id, id));
  return { deleted: true, id };
}
