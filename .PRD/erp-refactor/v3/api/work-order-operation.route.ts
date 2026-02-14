// CRUD API handlers for Work Order Operation
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { workOrderOperation } from '../db/schema.js';
import { WorkOrderOperationSchema, WorkOrderOperationInsertSchema } from '../types/work-order-operation.js';

export const ROUTE_PREFIX = '/work-order-operation';

/**
 * List Work Order Operation records.
 */
export async function listWorkOrderOperation(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(workOrderOperation).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Work Order Operation by ID.
 */
export async function getWorkOrderOperation(db: any, id: string) {
  const rows = await db.select().from(workOrderOperation).where(eq(workOrderOperation.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Work Order Operation.
 */
export async function createWorkOrderOperation(db: any, data: unknown) {
  const parsed = WorkOrderOperationInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(workOrderOperation).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Work Order Operation.
 */
export async function updateWorkOrderOperation(db: any, id: string, data: unknown) {
  const parsed = WorkOrderOperationInsertSchema.partial().parse(data);
  await db.update(workOrderOperation).set({ ...parsed, modified: new Date() }).where(eq(workOrderOperation.id, id));
  return getWorkOrderOperation(db, id);
}

/**
 * Delete a Work Order Operation by ID.
 */
export async function deleteWorkOrderOperation(db: any, id: string) {
  await db.delete(workOrderOperation).where(eq(workOrderOperation.id, id));
  return { deleted: true, id };
}
