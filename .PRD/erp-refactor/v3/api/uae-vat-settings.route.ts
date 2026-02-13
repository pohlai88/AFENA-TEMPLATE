// CRUD API handlers for UAE VAT Settings
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { uaeVatSettings } from '../db/schema.js';
import { UaeVatSettingsSchema, UaeVatSettingsInsertSchema } from '../types/uae-vat-settings.js';

export const ROUTE_PREFIX = '/uae-vat-settings';

/**
 * List UAE VAT Settings records.
 */
export async function listUaeVatSettings(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(uaeVatSettings).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single UAE VAT Settings by ID.
 */
export async function getUaeVatSettings(db: any, id: string) {
  const rows = await db.select().from(uaeVatSettings).where(eq(uaeVatSettings.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new UAE VAT Settings.
 */
export async function createUaeVatSettings(db: any, data: unknown) {
  const parsed = UaeVatSettingsInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(uaeVatSettings).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing UAE VAT Settings.
 */
export async function updateUaeVatSettings(db: any, id: string, data: unknown) {
  const parsed = UaeVatSettingsInsertSchema.partial().parse(data);
  await db.update(uaeVatSettings).set({ ...parsed, modified: new Date() }).where(eq(uaeVatSettings.id, id));
  return getUaeVatSettings(db, id);
}

/**
 * Delete a UAE VAT Settings by ID.
 */
export async function deleteUaeVatSettings(db: any, id: string) {
  await db.delete(uaeVatSettings).where(eq(uaeVatSettings.id, id));
  return { deleted: true, id };
}
