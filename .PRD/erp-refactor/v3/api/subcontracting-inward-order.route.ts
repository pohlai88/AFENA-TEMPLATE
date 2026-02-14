// CRUD API handlers for Subcontracting Inward Order
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { subcontractingInwardOrder } from '../db/schema.js';
import { SubcontractingInwardOrderSchema, SubcontractingInwardOrderInsertSchema } from '../types/subcontracting-inward-order.js';

export const ROUTE_PREFIX = '/subcontracting-inward-order';

/**
 * List Subcontracting Inward Order records.
 */
export async function listSubcontractingInwardOrder(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(subcontractingInwardOrder).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Subcontracting Inward Order by ID.
 */
export async function getSubcontractingInwardOrder(db: any, id: string) {
  const rows = await db.select().from(subcontractingInwardOrder).where(eq(subcontractingInwardOrder.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Subcontracting Inward Order.
 */
export async function createSubcontractingInwardOrder(db: any, data: unknown) {
  const parsed = SubcontractingInwardOrderInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(subcontractingInwardOrder).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Subcontracting Inward Order.
 */
export async function updateSubcontractingInwardOrder(db: any, id: string, data: unknown) {
  const parsed = SubcontractingInwardOrderInsertSchema.partial().parse(data);
  await db.update(subcontractingInwardOrder).set({ ...parsed, modified: new Date() }).where(eq(subcontractingInwardOrder.id, id));
  return getSubcontractingInwardOrder(db, id);
}

/**
 * Delete a Subcontracting Inward Order by ID.
 */
export async function deleteSubcontractingInwardOrder(db: any, id: string) {
  await db.delete(subcontractingInwardOrder).where(eq(subcontractingInwardOrder.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Subcontracting Inward Order (set docstatus = 1).
 */
export async function submitSubcontractingInwardOrder(db: any, id: string) {
  await db.update(subcontractingInwardOrder).set({ docstatus: 1, modified: new Date() }).where(eq(subcontractingInwardOrder.id, id));
  return getSubcontractingInwardOrder(db, id);
}

/**
 * Cancel a Subcontracting Inward Order (set docstatus = 2).
 */
export async function cancelSubcontractingInwardOrder(db: any, id: string) {
  await db.update(subcontractingInwardOrder).set({ docstatus: 2, modified: new Date() }).where(eq(subcontractingInwardOrder.id, id));
  return getSubcontractingInwardOrder(db, id);
}
