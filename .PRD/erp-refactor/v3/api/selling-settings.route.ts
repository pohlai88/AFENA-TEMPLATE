// CRUD API handlers for Selling Settings
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { sellingSettings } from '../db/schema.js';
import { SellingSettingsSchema, SellingSettingsInsertSchema } from '../types/selling-settings.js';

export const ROUTE_PREFIX = '/selling-settings';

/**
 * List Selling Settings records.
 */
export async function listSellingSettings(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(sellingSettings).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Selling Settings by ID.
 */
export async function getSellingSettings(db: any, id: string) {
  const rows = await db.select().from(sellingSettings).where(eq(sellingSettings.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Selling Settings.
 */
export async function createSellingSettings(db: any, data: unknown) {
  const parsed = SellingSettingsInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(sellingSettings).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Selling Settings.
 */
export async function updateSellingSettings(db: any, id: string, data: unknown) {
  const parsed = SellingSettingsInsertSchema.partial().parse(data);
  await db.update(sellingSettings).set({ ...parsed, modified: new Date() }).where(eq(sellingSettings.id, id));
  return getSellingSettings(db, id);
}

/**
 * Delete a Selling Settings by ID.
 */
export async function deleteSellingSettings(db: any, id: string) {
  await db.delete(sellingSettings).where(eq(sellingSettings.id, id));
  return { deleted: true, id };
}
