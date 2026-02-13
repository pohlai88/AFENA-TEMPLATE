// CRUD API handlers for Journal Entry
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { journalEntry } from '../db/schema.js';
import { JournalEntrySchema, JournalEntryInsertSchema } from '../types/journal-entry.js';

export const ROUTE_PREFIX = '/journal-entry';

/**
 * List Journal Entry records.
 */
export async function listJournalEntry(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(journalEntry).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Journal Entry by ID.
 */
export async function getJournalEntry(db: any, id: string) {
  const rows = await db.select().from(journalEntry).where(eq(journalEntry.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Journal Entry.
 */
export async function createJournalEntry(db: any, data: unknown) {
  const parsed = JournalEntryInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(journalEntry).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Journal Entry.
 */
export async function updateJournalEntry(db: any, id: string, data: unknown) {
  const parsed = JournalEntryInsertSchema.partial().parse(data);
  await db.update(journalEntry).set({ ...parsed, modified: new Date() }).where(eq(journalEntry.id, id));
  return getJournalEntry(db, id);
}

/**
 * Delete a Journal Entry by ID.
 */
export async function deleteJournalEntry(db: any, id: string) {
  await db.delete(journalEntry).where(eq(journalEntry.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Journal Entry (set docstatus = 1).
 */
export async function submitJournalEntry(db: any, id: string) {
  await db.update(journalEntry).set({ docstatus: 1, modified: new Date() }).where(eq(journalEntry.id, id));
  return getJournalEntry(db, id);
}

/**
 * Cancel a Journal Entry (set docstatus = 2).
 */
export async function cancelJournalEntry(db: any, id: string) {
  await db.update(journalEntry).set({ docstatus: 2, modified: new Date() }).where(eq(journalEntry.id, id));
  return getJournalEntry(db, id);
}
