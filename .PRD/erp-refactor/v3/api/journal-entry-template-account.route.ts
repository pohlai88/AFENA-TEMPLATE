// CRUD API handlers for Journal Entry Template Account
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { journalEntryTemplateAccount } from '../db/schema.js';
import { JournalEntryTemplateAccountSchema, JournalEntryTemplateAccountInsertSchema } from '../types/journal-entry-template-account.js';

export const ROUTE_PREFIX = '/journal-entry-template-account';

/**
 * List Journal Entry Template Account records.
 */
export async function listJournalEntryTemplateAccount(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(journalEntryTemplateAccount).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Journal Entry Template Account by ID.
 */
export async function getJournalEntryTemplateAccount(db: any, id: string) {
  const rows = await db.select().from(journalEntryTemplateAccount).where(eq(journalEntryTemplateAccount.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Journal Entry Template Account.
 */
export async function createJournalEntryTemplateAccount(db: any, data: unknown) {
  const parsed = JournalEntryTemplateAccountInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(journalEntryTemplateAccount).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Journal Entry Template Account.
 */
export async function updateJournalEntryTemplateAccount(db: any, id: string, data: unknown) {
  const parsed = JournalEntryTemplateAccountInsertSchema.partial().parse(data);
  await db.update(journalEntryTemplateAccount).set({ ...parsed, modified: new Date() }).where(eq(journalEntryTemplateAccount.id, id));
  return getJournalEntryTemplateAccount(db, id);
}

/**
 * Delete a Journal Entry Template Account by ID.
 */
export async function deleteJournalEntryTemplateAccount(db: any, id: string) {
  await db.delete(journalEntryTemplateAccount).where(eq(journalEntryTemplateAccount.id, id));
  return { deleted: true, id };
}
