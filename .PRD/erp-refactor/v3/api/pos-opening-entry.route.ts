// CRUD API handlers for POS Opening Entry
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { posOpeningEntry } from '../db/schema.js';
import { PosOpeningEntrySchema, PosOpeningEntryInsertSchema } from '../types/pos-opening-entry.js';

export const ROUTE_PREFIX = '/pos-opening-entry';

/**
 * List POS Opening Entry records.
 */
export async function listPosOpeningEntry(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(posOpeningEntry).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single POS Opening Entry by ID.
 */
export async function getPosOpeningEntry(db: any, id: string) {
  const rows = await db.select().from(posOpeningEntry).where(eq(posOpeningEntry.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new POS Opening Entry.
 */
export async function createPosOpeningEntry(db: any, data: unknown) {
  const parsed = PosOpeningEntryInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(posOpeningEntry).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing POS Opening Entry.
 */
export async function updatePosOpeningEntry(db: any, id: string, data: unknown) {
  const parsed = PosOpeningEntryInsertSchema.partial().parse(data);
  await db.update(posOpeningEntry).set({ ...parsed, modified: new Date() }).where(eq(posOpeningEntry.id, id));
  return getPosOpeningEntry(db, id);
}

/**
 * Delete a POS Opening Entry by ID.
 */
export async function deletePosOpeningEntry(db: any, id: string) {
  await db.delete(posOpeningEntry).where(eq(posOpeningEntry.id, id));
  return { deleted: true, id };
}

/**
 * Submit a POS Opening Entry (set docstatus = 1).
 */
export async function submitPosOpeningEntry(db: any, id: string) {
  await db.update(posOpeningEntry).set({ docstatus: 1, modified: new Date() }).where(eq(posOpeningEntry.id, id));
  return getPosOpeningEntry(db, id);
}

/**
 * Cancel a POS Opening Entry (set docstatus = 2).
 */
export async function cancelPosOpeningEntry(db: any, id: string) {
  await db.update(posOpeningEntry).set({ docstatus: 2, modified: new Date() }).where(eq(posOpeningEntry.id, id));
  return getPosOpeningEntry(db, id);
}
