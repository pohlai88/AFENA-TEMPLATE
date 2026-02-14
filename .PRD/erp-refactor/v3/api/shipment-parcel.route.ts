// CRUD API handlers for Shipment Parcel
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { shipmentParcel } from '../db/schema.js';
import { ShipmentParcelSchema, ShipmentParcelInsertSchema } from '../types/shipment-parcel.js';

export const ROUTE_PREFIX = '/shipment-parcel';

/**
 * List Shipment Parcel records.
 */
export async function listShipmentParcel(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(shipmentParcel).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Shipment Parcel by ID.
 */
export async function getShipmentParcel(db: any, id: string) {
  const rows = await db.select().from(shipmentParcel).where(eq(shipmentParcel.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Shipment Parcel.
 */
export async function createShipmentParcel(db: any, data: unknown) {
  const parsed = ShipmentParcelInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(shipmentParcel).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Shipment Parcel.
 */
export async function updateShipmentParcel(db: any, id: string, data: unknown) {
  const parsed = ShipmentParcelInsertSchema.partial().parse(data);
  await db.update(shipmentParcel).set({ ...parsed, modified: new Date() }).where(eq(shipmentParcel.id, id));
  return getShipmentParcel(db, id);
}

/**
 * Delete a Shipment Parcel by ID.
 */
export async function deleteShipmentParcel(db: any, id: string) {
  await db.delete(shipmentParcel).where(eq(shipmentParcel.id, id));
  return { deleted: true, id };
}
