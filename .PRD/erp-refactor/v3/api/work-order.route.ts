// CRUD API handlers for Work Order
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { workOrder } from '../db/schema.js';
import { WorkOrderSchema, WorkOrderInsertSchema } from '../types/work-order.js';

export const ROUTE_PREFIX = '/work-order';

/**
 * List Work Order records.
 */
export async function listWorkOrder(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(workOrder).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Work Order by ID.
 */
export async function getWorkOrder(db: any, id: string) {
  const rows = await db.select().from(workOrder).where(eq(workOrder.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Work Order.
 */
export async function createWorkOrder(db: any, data: unknown) {
  const parsed = WorkOrderInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(workOrder).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Work Order.
 */
export async function updateWorkOrder(db: any, id: string, data: unknown) {
  const parsed = WorkOrderInsertSchema.partial().parse(data);
  await db.update(workOrder).set({ ...parsed, modified: new Date() }).where(eq(workOrder.id, id));
  return getWorkOrder(db, id);
}

/**
 * Delete a Work Order by ID.
 */
export async function deleteWorkOrder(db: any, id: string) {
  await db.delete(workOrder).where(eq(workOrder.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Work Order (set docstatus = 1).
 */
export async function submitWorkOrder(db: any, id: string) {
  await db.update(workOrder).set({ docstatus: 1, modified: new Date() }).where(eq(workOrder.id, id));
  return getWorkOrder(db, id);
}

/**
 * Cancel a Work Order (set docstatus = 2).
 */
export async function cancelWorkOrder(db: any, id: string) {
  await db.update(workOrder).set({ docstatus: 2, modified: new Date() }).where(eq(workOrder.id, id));
  return getWorkOrder(db, id);
}
