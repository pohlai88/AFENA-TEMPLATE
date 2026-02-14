// CRUD API handlers for Subcontracting Inward Order Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { subcontractingInwardOrderItem } from '../db/schema.js';
import { SubcontractingInwardOrderItemSchema, SubcontractingInwardOrderItemInsertSchema } from '../types/subcontracting-inward-order-item.js';

export const ROUTE_PREFIX = '/subcontracting-inward-order-item';

/**
 * List Subcontracting Inward Order Item records.
 */
export async function listSubcontractingInwardOrderItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(subcontractingInwardOrderItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Subcontracting Inward Order Item by ID.
 */
export async function getSubcontractingInwardOrderItem(db: any, id: string) {
  const rows = await db.select().from(subcontractingInwardOrderItem).where(eq(subcontractingInwardOrderItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Subcontracting Inward Order Item.
 */
export async function createSubcontractingInwardOrderItem(db: any, data: unknown) {
  const parsed = SubcontractingInwardOrderItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(subcontractingInwardOrderItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Subcontracting Inward Order Item.
 */
export async function updateSubcontractingInwardOrderItem(db: any, id: string, data: unknown) {
  const parsed = SubcontractingInwardOrderItemInsertSchema.partial().parse(data);
  await db.update(subcontractingInwardOrderItem).set({ ...parsed, modified: new Date() }).where(eq(subcontractingInwardOrderItem.id, id));
  return getSubcontractingInwardOrderItem(db, id);
}

/**
 * Delete a Subcontracting Inward Order Item by ID.
 */
export async function deleteSubcontractingInwardOrderItem(db: any, id: string) {
  await db.delete(subcontractingInwardOrderItem).where(eq(subcontractingInwardOrderItem.id, id));
  return { deleted: true, id };
}
