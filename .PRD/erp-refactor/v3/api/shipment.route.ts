// CRUD API handlers for Shipment
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { shipment } from '../db/schema.js';
import { ShipmentSchema, ShipmentInsertSchema } from '../types/shipment.js';

export const ROUTE_PREFIX = '/shipment';

/**
 * List Shipment records.
 */
export async function listShipment(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(shipment).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Shipment by ID.
 */
export async function getShipment(db: any, id: string) {
  const rows = await db.select().from(shipment).where(eq(shipment.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Shipment.
 */
export async function createShipment(db: any, data: unknown) {
  const parsed = ShipmentInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(shipment).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Shipment.
 */
export async function updateShipment(db: any, id: string, data: unknown) {
  const parsed = ShipmentInsertSchema.partial().parse(data);
  await db.update(shipment).set({ ...parsed, modified: new Date() }).where(eq(shipment.id, id));
  return getShipment(db, id);
}

/**
 * Delete a Shipment by ID.
 */
export async function deleteShipment(db: any, id: string) {
  await db.delete(shipment).where(eq(shipment.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Shipment (set docstatus = 1).
 */
export async function submitShipment(db: any, id: string) {
  await db.update(shipment).set({ docstatus: 1, modified: new Date() }).where(eq(shipment.id, id));
  return getShipment(db, id);
}

/**
 * Cancel a Shipment (set docstatus = 2).
 */
export async function cancelShipment(db: any, id: string) {
  await db.update(shipment).set({ docstatus: 2, modified: new Date() }).where(eq(shipment.id, id));
  return getShipment(db, id);
}
