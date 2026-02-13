// CRUD API handlers for Serial and Batch Bundle
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { serialAndBatchBundle } from '../db/schema.js';
import { SerialAndBatchBundleSchema, SerialAndBatchBundleInsertSchema } from '../types/serial-and-batch-bundle.js';

export const ROUTE_PREFIX = '/serial-and-batch-bundle';

/**
 * List Serial and Batch Bundle records.
 */
export async function listSerialAndBatchBundle(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(serialAndBatchBundle).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Serial and Batch Bundle by ID.
 */
export async function getSerialAndBatchBundle(db: any, id: string) {
  const rows = await db.select().from(serialAndBatchBundle).where(eq(serialAndBatchBundle.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Serial and Batch Bundle.
 */
export async function createSerialAndBatchBundle(db: any, data: unknown) {
  const parsed = SerialAndBatchBundleInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(serialAndBatchBundle).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Serial and Batch Bundle.
 */
export async function updateSerialAndBatchBundle(db: any, id: string, data: unknown) {
  const parsed = SerialAndBatchBundleInsertSchema.partial().parse(data);
  await db.update(serialAndBatchBundle).set({ ...parsed, modified: new Date() }).where(eq(serialAndBatchBundle.id, id));
  return getSerialAndBatchBundle(db, id);
}

/**
 * Delete a Serial and Batch Bundle by ID.
 */
export async function deleteSerialAndBatchBundle(db: any, id: string) {
  await db.delete(serialAndBatchBundle).where(eq(serialAndBatchBundle.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Serial and Batch Bundle (set docstatus = 1).
 */
export async function submitSerialAndBatchBundle(db: any, id: string) {
  await db.update(serialAndBatchBundle).set({ docstatus: 1, modified: new Date() }).where(eq(serialAndBatchBundle.id, id));
  return getSerialAndBatchBundle(db, id);
}

/**
 * Cancel a Serial and Batch Bundle (set docstatus = 2).
 */
export async function cancelSerialAndBatchBundle(db: any, id: string) {
  await db.update(serialAndBatchBundle).set({ docstatus: 2, modified: new Date() }).where(eq(serialAndBatchBundle.id, id));
  return getSerialAndBatchBundle(db, id);
}
