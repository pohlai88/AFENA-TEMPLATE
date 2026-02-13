// CRUD API handlers for Shipment Delivery Note
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { shipmentDeliveryNote } from '../db/schema.js';
import { ShipmentDeliveryNoteSchema, ShipmentDeliveryNoteInsertSchema } from '../types/shipment-delivery-note.js';

export const ROUTE_PREFIX = '/shipment-delivery-note';

/**
 * List Shipment Delivery Note records.
 */
export async function listShipmentDeliveryNote(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(shipmentDeliveryNote).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Shipment Delivery Note by ID.
 */
export async function getShipmentDeliveryNote(db: any, id: string) {
  const rows = await db.select().from(shipmentDeliveryNote).where(eq(shipmentDeliveryNote.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Shipment Delivery Note.
 */
export async function createShipmentDeliveryNote(db: any, data: unknown) {
  const parsed = ShipmentDeliveryNoteInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(shipmentDeliveryNote).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Shipment Delivery Note.
 */
export async function updateShipmentDeliveryNote(db: any, id: string, data: unknown) {
  const parsed = ShipmentDeliveryNoteInsertSchema.partial().parse(data);
  await db.update(shipmentDeliveryNote).set({ ...parsed, modified: new Date() }).where(eq(shipmentDeliveryNote.id, id));
  return getShipmentDeliveryNote(db, id);
}

/**
 * Delete a Shipment Delivery Note by ID.
 */
export async function deleteShipmentDeliveryNote(db: any, id: string) {
  await db.delete(shipmentDeliveryNote).where(eq(shipmentDeliveryNote.id, id));
  return { deleted: true, id };
}
