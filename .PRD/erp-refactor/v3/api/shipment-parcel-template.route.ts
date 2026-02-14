// CRUD API handlers for Shipment Parcel Template
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { shipmentParcelTemplate } from '../db/schema.js';
import { ShipmentParcelTemplateSchema, ShipmentParcelTemplateInsertSchema } from '../types/shipment-parcel-template.js';

export const ROUTE_PREFIX = '/shipment-parcel-template';

/**
 * List Shipment Parcel Template records.
 */
export async function listShipmentParcelTemplate(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(shipmentParcelTemplate).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Shipment Parcel Template by ID.
 */
export async function getShipmentParcelTemplate(db: any, id: string) {
  const rows = await db.select().from(shipmentParcelTemplate).where(eq(shipmentParcelTemplate.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Shipment Parcel Template.
 */
export async function createShipmentParcelTemplate(db: any, data: unknown) {
  const parsed = ShipmentParcelTemplateInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(shipmentParcelTemplate).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Shipment Parcel Template.
 */
export async function updateShipmentParcelTemplate(db: any, id: string, data: unknown) {
  const parsed = ShipmentParcelTemplateInsertSchema.partial().parse(data);
  await db.update(shipmentParcelTemplate).set({ ...parsed, modified: new Date() }).where(eq(shipmentParcelTemplate.id, id));
  return getShipmentParcelTemplate(db, id);
}

/**
 * Delete a Shipment Parcel Template by ID.
 */
export async function deleteShipmentParcelTemplate(db: any, id: string) {
  await db.delete(shipmentParcelTemplate).where(eq(shipmentParcelTemplate.id, id));
  return { deleted: true, id };
}
