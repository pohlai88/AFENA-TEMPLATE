// CRUD API handlers for Subcontracting Order Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { subcontractingOrderItem } from '../db/schema.js';
import { SubcontractingOrderItemSchema, SubcontractingOrderItemInsertSchema } from '../types/subcontracting-order-item.js';

export const ROUTE_PREFIX = '/subcontracting-order-item';

/**
 * List Subcontracting Order Item records.
 */
export async function listSubcontractingOrderItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(subcontractingOrderItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Subcontracting Order Item by ID.
 */
export async function getSubcontractingOrderItem(db: any, id: string) {
  const rows = await db.select().from(subcontractingOrderItem).where(eq(subcontractingOrderItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Subcontracting Order Item.
 */
export async function createSubcontractingOrderItem(db: any, data: unknown) {
  const parsed = SubcontractingOrderItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(subcontractingOrderItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Subcontracting Order Item.
 */
export async function updateSubcontractingOrderItem(db: any, id: string, data: unknown) {
  const parsed = SubcontractingOrderItemInsertSchema.partial().parse(data);
  await db.update(subcontractingOrderItem).set({ ...parsed, modified: new Date() }).where(eq(subcontractingOrderItem.id, id));
  return getSubcontractingOrderItem(db, id);
}

/**
 * Delete a Subcontracting Order Item by ID.
 */
export async function deleteSubcontractingOrderItem(db: any, id: string) {
  await db.delete(subcontractingOrderItem).where(eq(subcontractingOrderItem.id, id));
  return { deleted: true, id };
}
