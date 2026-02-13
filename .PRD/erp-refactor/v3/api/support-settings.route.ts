// CRUD API handlers for Support Settings
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { supportSettings } from '../db/schema.js';
import { SupportSettingsSchema, SupportSettingsInsertSchema } from '../types/support-settings.js';

export const ROUTE_PREFIX = '/support-settings';

/**
 * List Support Settings records.
 */
export async function listSupportSettings(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(supportSettings).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Support Settings by ID.
 */
export async function getSupportSettings(db: any, id: string) {
  const rows = await db.select().from(supportSettings).where(eq(supportSettings.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Support Settings.
 */
export async function createSupportSettings(db: any, data: unknown) {
  const parsed = SupportSettingsInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(supportSettings).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Support Settings.
 */
export async function updateSupportSettings(db: any, id: string, data: unknown) {
  const parsed = SupportSettingsInsertSchema.partial().parse(data);
  await db.update(supportSettings).set({ ...parsed, modified: new Date() }).where(eq(supportSettings.id, id));
  return getSupportSettings(db, id);
}

/**
 * Delete a Support Settings by ID.
 */
export async function deleteSupportSettings(db: any, id: string) {
  await db.delete(supportSettings).where(eq(supportSettings.id, id));
  return { deleted: true, id };
}
