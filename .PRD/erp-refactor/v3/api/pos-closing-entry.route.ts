// CRUD API handlers for POS Closing Entry
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { posClosingEntry } from '../db/schema.js';
import { PosClosingEntrySchema, PosClosingEntryInsertSchema } from '../types/pos-closing-entry.js';

export const ROUTE_PREFIX = '/pos-closing-entry';

/**
 * List POS Closing Entry records.
 */
export async function listPosClosingEntry(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(posClosingEntry).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single POS Closing Entry by ID.
 */
export async function getPosClosingEntry(db: any, id: string) {
  const rows = await db.select().from(posClosingEntry).where(eq(posClosingEntry.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new POS Closing Entry.
 */
export async function createPosClosingEntry(db: any, data: unknown) {
  const parsed = PosClosingEntryInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(posClosingEntry).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing POS Closing Entry.
 */
export async function updatePosClosingEntry(db: any, id: string, data: unknown) {
  const parsed = PosClosingEntryInsertSchema.partial().parse(data);
  await db.update(posClosingEntry).set({ ...parsed, modified: new Date() }).where(eq(posClosingEntry.id, id));
  return getPosClosingEntry(db, id);
}

/**
 * Delete a POS Closing Entry by ID.
 */
export async function deletePosClosingEntry(db: any, id: string) {
  await db.delete(posClosingEntry).where(eq(posClosingEntry.id, id));
  return { deleted: true, id };
}

/**
 * Submit a POS Closing Entry (set docstatus = 1).
 */
export async function submitPosClosingEntry(db: any, id: string) {
  await db.update(posClosingEntry).set({ docstatus: 1, modified: new Date() }).where(eq(posClosingEntry.id, id));
  return getPosClosingEntry(db, id);
}

/**
 * Cancel a POS Closing Entry (set docstatus = 2).
 */
export async function cancelPosClosingEntry(db: any, id: string) {
  await db.update(posClosingEntry).set({ docstatus: 2, modified: new Date() }).where(eq(posClosingEntry.id, id));
  return getPosClosingEntry(db, id);
}
