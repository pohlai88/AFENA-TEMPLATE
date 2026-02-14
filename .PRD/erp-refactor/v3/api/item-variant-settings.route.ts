// CRUD API handlers for Item Variant Settings
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { itemVariantSettings } from '../db/schema.js';
import { ItemVariantSettingsSchema, ItemVariantSettingsInsertSchema } from '../types/item-variant-settings.js';

export const ROUTE_PREFIX = '/item-variant-settings';

/**
 * List Item Variant Settings records.
 */
export async function listItemVariantSettings(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(itemVariantSettings).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Item Variant Settings by ID.
 */
export async function getItemVariantSettings(db: any, id: string) {
  const rows = await db.select().from(itemVariantSettings).where(eq(itemVariantSettings.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Item Variant Settings.
 */
export async function createItemVariantSettings(db: any, data: unknown) {
  const parsed = ItemVariantSettingsInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(itemVariantSettings).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Item Variant Settings.
 */
export async function updateItemVariantSettings(db: any, id: string, data: unknown) {
  const parsed = ItemVariantSettingsInsertSchema.partial().parse(data);
  await db.update(itemVariantSettings).set({ ...parsed, modified: new Date() }).where(eq(itemVariantSettings.id, id));
  return getItemVariantSettings(db, id);
}

/**
 * Delete a Item Variant Settings by ID.
 */
export async function deleteItemVariantSettings(db: any, id: string) {
  await db.delete(itemVariantSettings).where(eq(itemVariantSettings.id, id));
  return { deleted: true, id };
}
