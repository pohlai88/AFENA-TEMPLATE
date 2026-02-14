// CRUD API handlers for Incoming Call Settings
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { incomingCallSettings } from '../db/schema.js';
import { IncomingCallSettingsSchema, IncomingCallSettingsInsertSchema } from '../types/incoming-call-settings.js';

export const ROUTE_PREFIX = '/incoming-call-settings';

/**
 * List Incoming Call Settings records.
 */
export async function listIncomingCallSettings(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(incomingCallSettings).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Incoming Call Settings by ID.
 */
export async function getIncomingCallSettings(db: any, id: string) {
  const rows = await db.select().from(incomingCallSettings).where(eq(incomingCallSettings.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Incoming Call Settings.
 */
export async function createIncomingCallSettings(db: any, data: unknown) {
  const parsed = IncomingCallSettingsInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(incomingCallSettings).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Incoming Call Settings.
 */
export async function updateIncomingCallSettings(db: any, id: string, data: unknown) {
  const parsed = IncomingCallSettingsInsertSchema.partial().parse(data);
  await db.update(incomingCallSettings).set({ ...parsed, modified: new Date() }).where(eq(incomingCallSettings.id, id));
  return getIncomingCallSettings(db, id);
}

/**
 * Delete a Incoming Call Settings by ID.
 */
export async function deleteIncomingCallSettings(db: any, id: string) {
  await db.delete(incomingCallSettings).where(eq(incomingCallSettings.id, id));
  return { deleted: true, id };
}
