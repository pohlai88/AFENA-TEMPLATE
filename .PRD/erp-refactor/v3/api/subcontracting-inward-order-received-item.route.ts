// CRUD API handlers for Subcontracting Inward Order Received Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { subcontractingInwardOrderReceivedItem } from '../db/schema.js';
import { SubcontractingInwardOrderReceivedItemSchema, SubcontractingInwardOrderReceivedItemInsertSchema } from '../types/subcontracting-inward-order-received-item.js';

export const ROUTE_PREFIX = '/subcontracting-inward-order-received-item';

/**
 * List Subcontracting Inward Order Received Item records.
 */
export async function listSubcontractingInwardOrderReceivedItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(subcontractingInwardOrderReceivedItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Subcontracting Inward Order Received Item by ID.
 */
export async function getSubcontractingInwardOrderReceivedItem(db: any, id: string) {
  const rows = await db.select().from(subcontractingInwardOrderReceivedItem).where(eq(subcontractingInwardOrderReceivedItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Subcontracting Inward Order Received Item.
 */
export async function createSubcontractingInwardOrderReceivedItem(db: any, data: unknown) {
  const parsed = SubcontractingInwardOrderReceivedItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(subcontractingInwardOrderReceivedItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Subcontracting Inward Order Received Item.
 */
export async function updateSubcontractingInwardOrderReceivedItem(db: any, id: string, data: unknown) {
  const parsed = SubcontractingInwardOrderReceivedItemInsertSchema.partial().parse(data);
  await db.update(subcontractingInwardOrderReceivedItem).set({ ...parsed, modified: new Date() }).where(eq(subcontractingInwardOrderReceivedItem.id, id));
  return getSubcontractingInwardOrderReceivedItem(db, id);
}

/**
 * Delete a Subcontracting Inward Order Received Item by ID.
 */
export async function deleteSubcontractingInwardOrderReceivedItem(db: any, id: string) {
  await db.delete(subcontractingInwardOrderReceivedItem).where(eq(subcontractingInwardOrderReceivedItem.id, id));
  return { deleted: true, id };
}
