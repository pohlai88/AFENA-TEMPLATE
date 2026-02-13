// CRUD API handlers for Work Order Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { workOrderItem } from '../db/schema.js';
import { WorkOrderItemSchema, WorkOrderItemInsertSchema } from '../types/work-order-item.js';

export const ROUTE_PREFIX = '/work-order-item';

/**
 * List Work Order Item records.
 */
export async function listWorkOrderItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(workOrderItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Work Order Item by ID.
 */
export async function getWorkOrderItem(db: any, id: string) {
  const rows = await db.select().from(workOrderItem).where(eq(workOrderItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Work Order Item.
 */
export async function createWorkOrderItem(db: any, data: unknown) {
  const parsed = WorkOrderItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(workOrderItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Work Order Item.
 */
export async function updateWorkOrderItem(db: any, id: string, data: unknown) {
  const parsed = WorkOrderItemInsertSchema.partial().parse(data);
  await db.update(workOrderItem).set({ ...parsed, modified: new Date() }).where(eq(workOrderItem.id, id));
  return getWorkOrderItem(db, id);
}

/**
 * Delete a Work Order Item by ID.
 */
export async function deleteWorkOrderItem(db: any, id: string) {
  await db.delete(workOrderItem).where(eq(workOrderItem.id, id));
  return { deleted: true, id };
}
