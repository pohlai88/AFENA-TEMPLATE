// CRUD API handlers for South Africa VAT Settings
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { southAfricaVatSettings } from '../db/schema.js';
import { SouthAfricaVatSettingsSchema, SouthAfricaVatSettingsInsertSchema } from '../types/south-africa-vat-settings.js';

export const ROUTE_PREFIX = '/south-africa-vat-settings';

/**
 * List South Africa VAT Settings records.
 */
export async function listSouthAfricaVatSettings(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(southAfricaVatSettings).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single South Africa VAT Settings by ID.
 */
export async function getSouthAfricaVatSettings(db: any, id: string) {
  const rows = await db.select().from(southAfricaVatSettings).where(eq(southAfricaVatSettings.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new South Africa VAT Settings.
 */
export async function createSouthAfricaVatSettings(db: any, data: unknown) {
  const parsed = SouthAfricaVatSettingsInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(southAfricaVatSettings).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing South Africa VAT Settings.
 */
export async function updateSouthAfricaVatSettings(db: any, id: string, data: unknown) {
  const parsed = SouthAfricaVatSettingsInsertSchema.partial().parse(data);
  await db.update(southAfricaVatSettings).set({ ...parsed, modified: new Date() }).where(eq(southAfricaVatSettings.id, id));
  return getSouthAfricaVatSettings(db, id);
}

/**
 * Delete a South Africa VAT Settings by ID.
 */
export async function deleteSouthAfricaVatSettings(db: any, id: string) {
  await db.delete(southAfricaVatSettings).where(eq(southAfricaVatSettings.id, id));
  return { deleted: true, id };
}
