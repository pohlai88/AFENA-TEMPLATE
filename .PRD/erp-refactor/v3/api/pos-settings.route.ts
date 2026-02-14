// CRUD API handlers for POS Settings
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { posSettings } from '../db/schema.js';
import { PosSettingsSchema, PosSettingsInsertSchema } from '../types/pos-settings.js';

export const ROUTE_PREFIX = '/pos-settings';

/**
 * List POS Settings records.
 */
export async function listPosSettings(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(posSettings).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single POS Settings by ID.
 */
export async function getPosSettings(db: any, id: string) {
  const rows = await db.select().from(posSettings).where(eq(posSettings.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new POS Settings.
 */
export async function createPosSettings(db: any, data: unknown) {
  const parsed = PosSettingsInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(posSettings).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing POS Settings.
 */
export async function updatePosSettings(db: any, id: string, data: unknown) {
  const parsed = PosSettingsInsertSchema.partial().parse(data);
  await db.update(posSettings).set({ ...parsed, modified: new Date() }).where(eq(posSettings.id, id));
  return getPosSettings(db, id);
}

/**
 * Delete a POS Settings by ID.
 */
export async function deletePosSettings(db: any, id: string) {
  await db.delete(posSettings).where(eq(posSettings.id, id));
  return { deleted: true, id };
}
