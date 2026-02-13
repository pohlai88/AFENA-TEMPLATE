// CRUD API handlers for Delivery Stop
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { deliveryStop } from '../db/schema.js';
import { DeliveryStopSchema, DeliveryStopInsertSchema } from '../types/delivery-stop.js';

export const ROUTE_PREFIX = '/delivery-stop';

/**
 * List Delivery Stop records.
 */
export async function listDeliveryStop(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(deliveryStop).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Delivery Stop by ID.
 */
export async function getDeliveryStop(db: any, id: string) {
  const rows = await db.select().from(deliveryStop).where(eq(deliveryStop.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Delivery Stop.
 */
export async function createDeliveryStop(db: any, data: unknown) {
  const parsed = DeliveryStopInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(deliveryStop).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Delivery Stop.
 */
export async function updateDeliveryStop(db: any, id: string, data: unknown) {
  const parsed = DeliveryStopInsertSchema.partial().parse(data);
  await db.update(deliveryStop).set({ ...parsed, modified: new Date() }).where(eq(deliveryStop.id, id));
  return getDeliveryStop(db, id);
}

/**
 * Delete a Delivery Stop by ID.
 */
export async function deleteDeliveryStop(db: any, id: string) {
  await db.delete(deliveryStop).where(eq(deliveryStop.id, id));
  return { deleted: true, id };
}
