// CRUD API handlers for Serial and Batch Entry
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { serialAndBatchEntry } from '../db/schema.js';
import { SerialAndBatchEntrySchema, SerialAndBatchEntryInsertSchema } from '../types/serial-and-batch-entry.js';

export const ROUTE_PREFIX = '/serial-and-batch-entry';

/**
 * List Serial and Batch Entry records.
 */
export async function listSerialAndBatchEntry(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(serialAndBatchEntry).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Serial and Batch Entry by ID.
 */
export async function getSerialAndBatchEntry(db: any, id: string) {
  const rows = await db.select().from(serialAndBatchEntry).where(eq(serialAndBatchEntry.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Serial and Batch Entry.
 */
export async function createSerialAndBatchEntry(db: any, data: unknown) {
  const parsed = SerialAndBatchEntryInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(serialAndBatchEntry).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Serial and Batch Entry.
 */
export async function updateSerialAndBatchEntry(db: any, id: string, data: unknown) {
  const parsed = SerialAndBatchEntryInsertSchema.partial().parse(data);
  await db.update(serialAndBatchEntry).set({ ...parsed, modified: new Date() }).where(eq(serialAndBatchEntry.id, id));
  return getSerialAndBatchEntry(db, id);
}

/**
 * Delete a Serial and Batch Entry by ID.
 */
export async function deleteSerialAndBatchEntry(db: any, id: string) {
  await db.delete(serialAndBatchEntry).where(eq(serialAndBatchEntry.id, id));
  return { deleted: true, id };
}
