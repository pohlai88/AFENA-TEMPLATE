// CRUD API handlers for Journal Entry Template
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { journalEntryTemplate } from '../db/schema.js';
import { JournalEntryTemplateSchema, JournalEntryTemplateInsertSchema } from '../types/journal-entry-template.js';

export const ROUTE_PREFIX = '/journal-entry-template';

/**
 * List Journal Entry Template records.
 */
export async function listJournalEntryTemplate(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(journalEntryTemplate).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Journal Entry Template by ID.
 */
export async function getJournalEntryTemplate(db: any, id: string) {
  const rows = await db.select().from(journalEntryTemplate).where(eq(journalEntryTemplate.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Journal Entry Template.
 */
export async function createJournalEntryTemplate(db: any, data: unknown) {
  const parsed = JournalEntryTemplateInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(journalEntryTemplate).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Journal Entry Template.
 */
export async function updateJournalEntryTemplate(db: any, id: string, data: unknown) {
  const parsed = JournalEntryTemplateInsertSchema.partial().parse(data);
  await db.update(journalEntryTemplate).set({ ...parsed, modified: new Date() }).where(eq(journalEntryTemplate.id, id));
  return getJournalEntryTemplate(db, id);
}

/**
 * Delete a Journal Entry Template by ID.
 */
export async function deleteJournalEntryTemplate(db: any, id: string) {
  await db.delete(journalEntryTemplate).where(eq(journalEntryTemplate.id, id));
  return { deleted: true, id };
}
