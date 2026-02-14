// CRUD API handlers for POS Closing Entry Detail
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { posClosingEntryDetail } from '../db/schema.js';
import { PosClosingEntryDetailSchema, PosClosingEntryDetailInsertSchema } from '../types/pos-closing-entry-detail.js';

export const ROUTE_PREFIX = '/pos-closing-entry-detail';

/**
 * List POS Closing Entry Detail records.
 */
export async function listPosClosingEntryDetail(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(posClosingEntryDetail).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single POS Closing Entry Detail by ID.
 */
export async function getPosClosingEntryDetail(db: any, id: string) {
  const rows = await db.select().from(posClosingEntryDetail).where(eq(posClosingEntryDetail.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new POS Closing Entry Detail.
 */
export async function createPosClosingEntryDetail(db: any, data: unknown) {
  const parsed = PosClosingEntryDetailInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(posClosingEntryDetail).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing POS Closing Entry Detail.
 */
export async function updatePosClosingEntryDetail(db: any, id: string, data: unknown) {
  const parsed = PosClosingEntryDetailInsertSchema.partial().parse(data);
  await db.update(posClosingEntryDetail).set({ ...parsed, modified: new Date() }).where(eq(posClosingEntryDetail.id, id));
  return getPosClosingEntryDetail(db, id);
}

/**
 * Delete a POS Closing Entry Detail by ID.
 */
export async function deletePosClosingEntryDetail(db: any, id: string) {
  await db.delete(posClosingEntryDetail).where(eq(posClosingEntryDetail.id, id));
  return { deleted: true, id };
}
