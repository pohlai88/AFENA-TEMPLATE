// CRUD API handlers for Delivery Trip
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { deliveryTrip } from '../db/schema.js';
import { DeliveryTripSchema, DeliveryTripInsertSchema } from '../types/delivery-trip.js';

export const ROUTE_PREFIX = '/delivery-trip';

/**
 * List Delivery Trip records.
 */
export async function listDeliveryTrip(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(deliveryTrip).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Delivery Trip by ID.
 */
export async function getDeliveryTrip(db: any, id: string) {
  const rows = await db.select().from(deliveryTrip).where(eq(deliveryTrip.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Delivery Trip.
 */
export async function createDeliveryTrip(db: any, data: unknown) {
  const parsed = DeliveryTripInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(deliveryTrip).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Delivery Trip.
 */
export async function updateDeliveryTrip(db: any, id: string, data: unknown) {
  const parsed = DeliveryTripInsertSchema.partial().parse(data);
  await db.update(deliveryTrip).set({ ...parsed, modified: new Date() }).where(eq(deliveryTrip.id, id));
  return getDeliveryTrip(db, id);
}

/**
 * Delete a Delivery Trip by ID.
 */
export async function deleteDeliveryTrip(db: any, id: string) {
  await db.delete(deliveryTrip).where(eq(deliveryTrip.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Delivery Trip (set docstatus = 1).
 */
export async function submitDeliveryTrip(db: any, id: string) {
  await db.update(deliveryTrip).set({ docstatus: 1, modified: new Date() }).where(eq(deliveryTrip.id, id));
  return getDeliveryTrip(db, id);
}

/**
 * Cancel a Delivery Trip (set docstatus = 2).
 */
export async function cancelDeliveryTrip(db: any, id: string) {
  await db.update(deliveryTrip).set({ docstatus: 2, modified: new Date() }).where(eq(deliveryTrip.id, id));
  return getDeliveryTrip(db, id);
}
