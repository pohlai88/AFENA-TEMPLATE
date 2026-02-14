// CRUD API handlers for Subcontracting Order Supplied Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { subcontractingOrderSuppliedItem } from '../db/schema.js';
import { SubcontractingOrderSuppliedItemSchema, SubcontractingOrderSuppliedItemInsertSchema } from '../types/subcontracting-order-supplied-item.js';

export const ROUTE_PREFIX = '/subcontracting-order-supplied-item';

/**
 * List Subcontracting Order Supplied Item records.
 */
export async function listSubcontractingOrderSuppliedItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(subcontractingOrderSuppliedItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Subcontracting Order Supplied Item by ID.
 */
export async function getSubcontractingOrderSuppliedItem(db: any, id: string) {
  const rows = await db.select().from(subcontractingOrderSuppliedItem).where(eq(subcontractingOrderSuppliedItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Subcontracting Order Supplied Item.
 */
export async function createSubcontractingOrderSuppliedItem(db: any, data: unknown) {
  const parsed = SubcontractingOrderSuppliedItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(subcontractingOrderSuppliedItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Subcontracting Order Supplied Item.
 */
export async function updateSubcontractingOrderSuppliedItem(db: any, id: string, data: unknown) {
  const parsed = SubcontractingOrderSuppliedItemInsertSchema.partial().parse(data);
  await db.update(subcontractingOrderSuppliedItem).set({ ...parsed, modified: new Date() }).where(eq(subcontractingOrderSuppliedItem.id, id));
  return getSubcontractingOrderSuppliedItem(db, id);
}

/**
 * Delete a Subcontracting Order Supplied Item by ID.
 */
export async function deleteSubcontractingOrderSuppliedItem(db: any, id: string) {
  await db.delete(subcontractingOrderSuppliedItem).where(eq(subcontractingOrderSuppliedItem.id, id));
  return { deleted: true, id };
}
