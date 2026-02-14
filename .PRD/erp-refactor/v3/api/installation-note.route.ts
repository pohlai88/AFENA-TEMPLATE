// CRUD API handlers for Installation Note
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { installationNote } from '../db/schema.js';
import { InstallationNoteSchema, InstallationNoteInsertSchema } from '../types/installation-note.js';

export const ROUTE_PREFIX = '/installation-note';

/**
 * List Installation Note records.
 */
export async function listInstallationNote(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(installationNote).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Installation Note by ID.
 */
export async function getInstallationNote(db: any, id: string) {
  const rows = await db.select().from(installationNote).where(eq(installationNote.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Installation Note.
 */
export async function createInstallationNote(db: any, data: unknown) {
  const parsed = InstallationNoteInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(installationNote).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Installation Note.
 */
export async function updateInstallationNote(db: any, id: string, data: unknown) {
  const parsed = InstallationNoteInsertSchema.partial().parse(data);
  await db.update(installationNote).set({ ...parsed, modified: new Date() }).where(eq(installationNote.id, id));
  return getInstallationNote(db, id);
}

/**
 * Delete a Installation Note by ID.
 */
export async function deleteInstallationNote(db: any, id: string) {
  await db.delete(installationNote).where(eq(installationNote.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Installation Note (set docstatus = 1).
 */
export async function submitInstallationNote(db: any, id: string) {
  await db.update(installationNote).set({ docstatus: 1, modified: new Date() }).where(eq(installationNote.id, id));
  return getInstallationNote(db, id);
}

/**
 * Cancel a Installation Note (set docstatus = 2).
 */
export async function cancelInstallationNote(db: any, id: string) {
  await db.update(installationNote).set({ docstatus: 2, modified: new Date() }).where(eq(installationNote.id, id));
  return getInstallationNote(db, id);
}
