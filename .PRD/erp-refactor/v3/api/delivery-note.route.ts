// CRUD API handlers for Delivery Note
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { deliveryNote } from '../db/schema.js';
import { DeliveryNoteSchema, DeliveryNoteInsertSchema } from '../types/delivery-note.js';

export const ROUTE_PREFIX = '/delivery-note';

/**
 * List Delivery Note records.
 */
export async function listDeliveryNote(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(deliveryNote).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Delivery Note by ID.
 */
export async function getDeliveryNote(db: any, id: string) {
  const rows = await db.select().from(deliveryNote).where(eq(deliveryNote.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Delivery Note.
 */
export async function createDeliveryNote(db: any, data: unknown) {
  const parsed = DeliveryNoteInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(deliveryNote).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Delivery Note.
 */
export async function updateDeliveryNote(db: any, id: string, data: unknown) {
  const parsed = DeliveryNoteInsertSchema.partial().parse(data);
  await db.update(deliveryNote).set({ ...parsed, modified: new Date() }).where(eq(deliveryNote.id, id));
  return getDeliveryNote(db, id);
}

/**
 * Delete a Delivery Note by ID.
 */
export async function deleteDeliveryNote(db: any, id: string) {
  await db.delete(deliveryNote).where(eq(deliveryNote.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Delivery Note (set docstatus = 1).
 */
export async function submitDeliveryNote(db: any, id: string) {
  await db.update(deliveryNote).set({ docstatus: 1, modified: new Date() }).where(eq(deliveryNote.id, id));
  return getDeliveryNote(db, id);
}

/**
 * Cancel a Delivery Note (set docstatus = 2).
 */
export async function cancelDeliveryNote(db: any, id: string) {
  await db.update(deliveryNote).set({ docstatus: 2, modified: new Date() }).where(eq(deliveryNote.id, id));
  return getDeliveryNote(db, id);
}
