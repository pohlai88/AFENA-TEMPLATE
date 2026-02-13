// CRUD API handlers for Sub Operation
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { subOperation } from '../db/schema.js';
import { SubOperationSchema, SubOperationInsertSchema } from '../types/sub-operation.js';

export const ROUTE_PREFIX = '/sub-operation';

/**
 * List Sub Operation records.
 */
export async function listSubOperation(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(subOperation).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Sub Operation by ID.
 */
export async function getSubOperation(db: any, id: string) {
  const rows = await db.select().from(subOperation).where(eq(subOperation.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Sub Operation.
 */
export async function createSubOperation(db: any, data: unknown) {
  const parsed = SubOperationInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(subOperation).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Sub Operation.
 */
export async function updateSubOperation(db: any, id: string, data: unknown) {
  const parsed = SubOperationInsertSchema.partial().parse(data);
  await db.update(subOperation).set({ ...parsed, modified: new Date() }).where(eq(subOperation.id, id));
  return getSubOperation(db, id);
}

/**
 * Delete a Sub Operation by ID.
 */
export async function deleteSubOperation(db: any, id: string) {
  await db.delete(subOperation).where(eq(subOperation.id, id));
  return { deleted: true, id };
}
