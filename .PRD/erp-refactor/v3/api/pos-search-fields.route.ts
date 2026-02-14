// CRUD API handlers for POS Search Fields
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { posSearchFields } from '../db/schema.js';
import { PosSearchFieldsSchema, PosSearchFieldsInsertSchema } from '../types/pos-search-fields.js';

export const ROUTE_PREFIX = '/pos-search-fields';

/**
 * List POS Search Fields records.
 */
export async function listPosSearchFields(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(posSearchFields).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single POS Search Fields by ID.
 */
export async function getPosSearchFields(db: any, id: string) {
  const rows = await db.select().from(posSearchFields).where(eq(posSearchFields.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new POS Search Fields.
 */
export async function createPosSearchFields(db: any, data: unknown) {
  const parsed = PosSearchFieldsInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(posSearchFields).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing POS Search Fields.
 */
export async function updatePosSearchFields(db: any, id: string, data: unknown) {
  const parsed = PosSearchFieldsInsertSchema.partial().parse(data);
  await db.update(posSearchFields).set({ ...parsed, modified: new Date() }).where(eq(posSearchFields.id, id));
  return getPosSearchFields(db, id);
}

/**
 * Delete a POS Search Fields by ID.
 */
export async function deletePosSearchFields(db: any, id: string) {
  await db.delete(posSearchFields).where(eq(posSearchFields.id, id));
  return { deleted: true, id };
}
