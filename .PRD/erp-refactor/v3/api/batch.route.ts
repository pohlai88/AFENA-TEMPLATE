// CRUD API handlers for Batch
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { batch } from '../db/schema.js';
import { BatchSchema, BatchInsertSchema } from '../types/batch.js';

export const ROUTE_PREFIX = '/batch';

/**
 * List Batch records.
 */
export async function listBatch(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(batch).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Batch by ID.
 */
export async function getBatch(db: any, id: string) {
  const rows = await db.select().from(batch).where(eq(batch.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Batch.
 */
export async function createBatch(db: any, data: unknown) {
  const parsed = BatchInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(batch).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Batch.
 */
export async function updateBatch(db: any, id: string, data: unknown) {
  const parsed = BatchInsertSchema.partial().parse(data);
  await db.update(batch).set({ ...parsed, modified: new Date() }).where(eq(batch.id, id));
  return getBatch(db, id);
}

/**
 * Delete a Batch by ID.
 */
export async function deleteBatch(db: any, id: string) {
  await db.delete(batch).where(eq(batch.id, id));
  return { deleted: true, id };
}
