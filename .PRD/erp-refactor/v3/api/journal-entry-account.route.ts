// CRUD API handlers for Journal Entry Account
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { journalEntryAccount } from '../db/schema.js';
import { JournalEntryAccountSchema, JournalEntryAccountInsertSchema } from '../types/journal-entry-account.js';

export const ROUTE_PREFIX = '/journal-entry-account';

/**
 * List Journal Entry Account records.
 */
export async function listJournalEntryAccount(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(journalEntryAccount).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Journal Entry Account by ID.
 */
export async function getJournalEntryAccount(db: any, id: string) {
  const rows = await db.select().from(journalEntryAccount).where(eq(journalEntryAccount.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Journal Entry Account.
 */
export async function createJournalEntryAccount(db: any, data: unknown) {
  const parsed = JournalEntryAccountInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(journalEntryAccount).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Journal Entry Account.
 */
export async function updateJournalEntryAccount(db: any, id: string, data: unknown) {
  const parsed = JournalEntryAccountInsertSchema.partial().parse(data);
  await db.update(journalEntryAccount).set({ ...parsed, modified: new Date() }).where(eq(journalEntryAccount.id, id));
  return getJournalEntryAccount(db, id);
}

/**
 * Delete a Journal Entry Account by ID.
 */
export async function deleteJournalEntryAccount(db: any, id: string) {
  await db.delete(journalEntryAccount).where(eq(journalEntryAccount.id, id));
  return { deleted: true, id };
}
