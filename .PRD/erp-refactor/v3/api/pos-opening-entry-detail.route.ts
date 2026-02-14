// CRUD API handlers for POS Opening Entry Detail
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { posOpeningEntryDetail } from '../db/schema.js';
import { PosOpeningEntryDetailSchema, PosOpeningEntryDetailInsertSchema } from '../types/pos-opening-entry-detail.js';

export const ROUTE_PREFIX = '/pos-opening-entry-detail';

/**
 * List POS Opening Entry Detail records.
 */
export async function listPosOpeningEntryDetail(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(posOpeningEntryDetail).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single POS Opening Entry Detail by ID.
 */
export async function getPosOpeningEntryDetail(db: any, id: string) {
  const rows = await db.select().from(posOpeningEntryDetail).where(eq(posOpeningEntryDetail.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new POS Opening Entry Detail.
 */
export async function createPosOpeningEntryDetail(db: any, data: unknown) {
  const parsed = PosOpeningEntryDetailInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(posOpeningEntryDetail).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing POS Opening Entry Detail.
 */
export async function updatePosOpeningEntryDetail(db: any, id: string, data: unknown) {
  const parsed = PosOpeningEntryDetailInsertSchema.partial().parse(data);
  await db.update(posOpeningEntryDetail).set({ ...parsed, modified: new Date() }).where(eq(posOpeningEntryDetail.id, id));
  return getPosOpeningEntryDetail(db, id);
}

/**
 * Delete a POS Opening Entry Detail by ID.
 */
export async function deletePosOpeningEntryDetail(db: any, id: string) {
  await db.delete(posOpeningEntryDetail).where(eq(posOpeningEntryDetail.id, id));
  return { deleted: true, id };
}
