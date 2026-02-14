// CRUD API handlers for Delivery Note Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { deliveryNoteItem } from '../db/schema.js';
import { DeliveryNoteItemSchema, DeliveryNoteItemInsertSchema } from '../types/delivery-note-item.js';

export const ROUTE_PREFIX = '/delivery-note-item';

/**
 * List Delivery Note Item records.
 */
export async function listDeliveryNoteItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(deliveryNoteItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Delivery Note Item by ID.
 */
export async function getDeliveryNoteItem(db: any, id: string) {
  const rows = await db.select().from(deliveryNoteItem).where(eq(deliveryNoteItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Delivery Note Item.
 */
export async function createDeliveryNoteItem(db: any, data: unknown) {
  const parsed = DeliveryNoteItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(deliveryNoteItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Delivery Note Item.
 */
export async function updateDeliveryNoteItem(db: any, id: string, data: unknown) {
  const parsed = DeliveryNoteItemInsertSchema.partial().parse(data);
  await db.update(deliveryNoteItem).set({ ...parsed, modified: new Date() }).where(eq(deliveryNoteItem.id, id));
  return getDeliveryNoteItem(db, id);
}

/**
 * Delete a Delivery Note Item by ID.
 */
export async function deleteDeliveryNoteItem(db: any, id: string) {
  await db.delete(deliveryNoteItem).where(eq(deliveryNoteItem.id, id));
  return { deleted: true, id };
}
