// CRUD API handlers for Delivery Schedule Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { deliveryScheduleItem } from '../db/schema.js';
import { DeliveryScheduleItemSchema, DeliveryScheduleItemInsertSchema } from '../types/delivery-schedule-item.js';

export const ROUTE_PREFIX = '/delivery-schedule-item';

/**
 * List Delivery Schedule Item records.
 */
export async function listDeliveryScheduleItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(deliveryScheduleItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Delivery Schedule Item by ID.
 */
export async function getDeliveryScheduleItem(db: any, id: string) {
  const rows = await db.select().from(deliveryScheduleItem).where(eq(deliveryScheduleItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Delivery Schedule Item.
 */
export async function createDeliveryScheduleItem(db: any, data: unknown) {
  const parsed = DeliveryScheduleItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(deliveryScheduleItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Delivery Schedule Item.
 */
export async function updateDeliveryScheduleItem(db: any, id: string, data: unknown) {
  const parsed = DeliveryScheduleItemInsertSchema.partial().parse(data);
  await db.update(deliveryScheduleItem).set({ ...parsed, modified: new Date() }).where(eq(deliveryScheduleItem.id, id));
  return getDeliveryScheduleItem(db, id);
}

/**
 * Delete a Delivery Schedule Item by ID.
 */
export async function deleteDeliveryScheduleItem(db: any, id: string) {
  await db.delete(deliveryScheduleItem).where(eq(deliveryScheduleItem.id, id));
  return { deleted: true, id };
}
