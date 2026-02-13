// CRUD API handlers for Manufacturing Settings
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { manufacturingSettings } from '../db/schema.js';
import { ManufacturingSettingsSchema, ManufacturingSettingsInsertSchema } from '../types/manufacturing-settings.js';

export const ROUTE_PREFIX = '/manufacturing-settings';

/**
 * List Manufacturing Settings records.
 */
export async function listManufacturingSettings(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(manufacturingSettings).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Manufacturing Settings by ID.
 */
export async function getManufacturingSettings(db: any, id: string) {
  const rows = await db.select().from(manufacturingSettings).where(eq(manufacturingSettings.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Manufacturing Settings.
 */
export async function createManufacturingSettings(db: any, data: unknown) {
  const parsed = ManufacturingSettingsInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(manufacturingSettings).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Manufacturing Settings.
 */
export async function updateManufacturingSettings(db: any, id: string, data: unknown) {
  const parsed = ManufacturingSettingsInsertSchema.partial().parse(data);
  await db.update(manufacturingSettings).set({ ...parsed, modified: new Date() }).where(eq(manufacturingSettings.id, id));
  return getManufacturingSettings(db, id);
}

/**
 * Delete a Manufacturing Settings by ID.
 */
export async function deleteManufacturingSettings(db: any, id: string) {
  await db.delete(manufacturingSettings).where(eq(manufacturingSettings.id, id));
  return { deleted: true, id };
}
