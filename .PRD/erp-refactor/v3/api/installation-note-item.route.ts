// CRUD API handlers for Installation Note Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { installationNoteItem } from '../db/schema.js';
import { InstallationNoteItemSchema, InstallationNoteItemInsertSchema } from '../types/installation-note-item.js';

export const ROUTE_PREFIX = '/installation-note-item';

/**
 * List Installation Note Item records.
 */
export async function listInstallationNoteItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(installationNoteItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Installation Note Item by ID.
 */
export async function getInstallationNoteItem(db: any, id: string) {
  const rows = await db.select().from(installationNoteItem).where(eq(installationNoteItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Installation Note Item.
 */
export async function createInstallationNoteItem(db: any, data: unknown) {
  const parsed = InstallationNoteItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(installationNoteItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Installation Note Item.
 */
export async function updateInstallationNoteItem(db: any, id: string, data: unknown) {
  const parsed = InstallationNoteItemInsertSchema.partial().parse(data);
  await db.update(installationNoteItem).set({ ...parsed, modified: new Date() }).where(eq(installationNoteItem.id, id));
  return getInstallationNoteItem(db, id);
}

/**
 * Delete a Installation Note Item by ID.
 */
export async function deleteInstallationNoteItem(db: any, id: string) {
  await db.delete(installationNoteItem).where(eq(installationNoteItem.id, id));
  return { deleted: true, id };
}
