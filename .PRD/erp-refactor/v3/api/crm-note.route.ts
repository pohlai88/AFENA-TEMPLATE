// CRUD API handlers for CRM Note
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { crmNote } from '../db/schema.js';
import { CrmNoteSchema, CrmNoteInsertSchema } from '../types/crm-note.js';

export const ROUTE_PREFIX = '/crm-note';

/**
 * List CRM Note records.
 */
export async function listCrmNote(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(crmNote).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single CRM Note by ID.
 */
export async function getCrmNote(db: any, id: string) {
  const rows = await db.select().from(crmNote).where(eq(crmNote.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new CRM Note.
 */
export async function createCrmNote(db: any, data: unknown) {
  const parsed = CrmNoteInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(crmNote).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing CRM Note.
 */
export async function updateCrmNote(db: any, id: string, data: unknown) {
  const parsed = CrmNoteInsertSchema.partial().parse(data);
  await db.update(crmNote).set({ ...parsed, modified: new Date() }).where(eq(crmNote.id, id));
  return getCrmNote(db, id);
}

/**
 * Delete a CRM Note by ID.
 */
export async function deleteCrmNote(db: any, id: string) {
  await db.delete(crmNote).where(eq(crmNote.id, id));
  return { deleted: true, id };
}
