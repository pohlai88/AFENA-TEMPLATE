// CRUD API handlers for Delivery Settings
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { deliverySettings } from '../db/schema.js';
import { DeliverySettingsSchema, DeliverySettingsInsertSchema } from '../types/delivery-settings.js';

export const ROUTE_PREFIX = '/delivery-settings';

/**
 * List Delivery Settings records.
 */
export async function listDeliverySettings(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(deliverySettings).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Delivery Settings by ID.
 */
export async function getDeliverySettings(db: any, id: string) {
  const rows = await db.select().from(deliverySettings).where(eq(deliverySettings.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Delivery Settings.
 */
export async function createDeliverySettings(db: any, data: unknown) {
  const parsed = DeliverySettingsInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(deliverySettings).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Delivery Settings.
 */
export async function updateDeliverySettings(db: any, id: string, data: unknown) {
  const parsed = DeliverySettingsInsertSchema.partial().parse(data);
  await db.update(deliverySettings).set({ ...parsed, modified: new Date() }).where(eq(deliverySettings.id, id));
  return getDeliverySettings(db, id);
}

/**
 * Delete a Delivery Settings by ID.
 */
export async function deleteDeliverySettings(db: any, id: string) {
  await db.delete(deliverySettings).where(eq(deliverySettings.id, id));
  return { deleted: true, id };
}
