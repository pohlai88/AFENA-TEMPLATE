// CRUD API handlers for Operation
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { operation } from '../db/schema.js';
import { OperationSchema, OperationInsertSchema } from '../types/operation.js';

export const ROUTE_PREFIX = '/operation';

/**
 * List Operation records.
 */
export async function listOperation(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(operation).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Operation by ID.
 */
export async function getOperation(db: any, id: string) {
  const rows = await db.select().from(operation).where(eq(operation.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Operation.
 */
export async function createOperation(db: any, data: unknown) {
  const parsed = OperationInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(operation).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Operation.
 */
export async function updateOperation(db: any, id: string, data: unknown) {
  const parsed = OperationInsertSchema.partial().parse(data);
  await db.update(operation).set({ ...parsed, modified: new Date() }).where(eq(operation.id, id));
  return getOperation(db, id);
}

/**
 * Delete a Operation by ID.
 */
export async function deleteOperation(db: any, id: string) {
  await db.delete(operation).where(eq(operation.id, id));
  return { deleted: true, id };
}
