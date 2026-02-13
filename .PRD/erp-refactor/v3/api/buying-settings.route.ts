// CRUD API handlers for Buying Settings
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { buyingSettings } from '../db/schema.js';
import { BuyingSettingsSchema, BuyingSettingsInsertSchema } from '../types/buying-settings.js';

export const ROUTE_PREFIX = '/buying-settings';

/**
 * List Buying Settings records.
 */
export async function listBuyingSettings(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(buyingSettings).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Buying Settings by ID.
 */
export async function getBuyingSettings(db: any, id: string) {
  const rows = await db.select().from(buyingSettings).where(eq(buyingSettings.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Buying Settings.
 */
export async function createBuyingSettings(db: any, data: unknown) {
  const parsed = BuyingSettingsInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(buyingSettings).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Buying Settings.
 */
export async function updateBuyingSettings(db: any, id: string, data: unknown) {
  const parsed = BuyingSettingsInsertSchema.partial().parse(data);
  await db.update(buyingSettings).set({ ...parsed, modified: new Date() }).where(eq(buyingSettings.id, id));
  return getBuyingSettings(db, id);
}

/**
 * Delete a Buying Settings by ID.
 */
export async function deleteBuyingSettings(db: any, id: string) {
  await db.delete(buyingSettings).where(eq(buyingSettings.id, id));
  return { deleted: true, id };
}
