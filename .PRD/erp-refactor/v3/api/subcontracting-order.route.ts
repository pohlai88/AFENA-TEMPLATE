// CRUD API handlers for Subcontracting Order
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { subcontractingOrder } from '../db/schema.js';
import { SubcontractingOrderSchema, SubcontractingOrderInsertSchema } from '../types/subcontracting-order.js';

export const ROUTE_PREFIX = '/subcontracting-order';

/**
 * List Subcontracting Order records.
 */
export async function listSubcontractingOrder(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(subcontractingOrder).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Subcontracting Order by ID.
 */
export async function getSubcontractingOrder(db: any, id: string) {
  const rows = await db.select().from(subcontractingOrder).where(eq(subcontractingOrder.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Subcontracting Order.
 */
export async function createSubcontractingOrder(db: any, data: unknown) {
  const parsed = SubcontractingOrderInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(subcontractingOrder).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Subcontracting Order.
 */
export async function updateSubcontractingOrder(db: any, id: string, data: unknown) {
  const parsed = SubcontractingOrderInsertSchema.partial().parse(data);
  await db.update(subcontractingOrder).set({ ...parsed, modified: new Date() }).where(eq(subcontractingOrder.id, id));
  return getSubcontractingOrder(db, id);
}

/**
 * Delete a Subcontracting Order by ID.
 */
export async function deleteSubcontractingOrder(db: any, id: string) {
  await db.delete(subcontractingOrder).where(eq(subcontractingOrder.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Subcontracting Order (set docstatus = 1).
 */
export async function submitSubcontractingOrder(db: any, id: string) {
  await db.update(subcontractingOrder).set({ docstatus: 1, modified: new Date() }).where(eq(subcontractingOrder.id, id));
  return getSubcontractingOrder(db, id);
}

/**
 * Cancel a Subcontracting Order (set docstatus = 2).
 */
export async function cancelSubcontractingOrder(db: any, id: string) {
  await db.update(subcontractingOrder).set({ docstatus: 2, modified: new Date() }).where(eq(subcontractingOrder.id, id));
  return getSubcontractingOrder(db, id);
}
