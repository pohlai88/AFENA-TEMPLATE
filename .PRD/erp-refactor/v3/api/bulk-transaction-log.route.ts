// CRUD API handlers for Bulk Transaction Log
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { bulkTransactionLog } from '../db/schema.js';
import { BulkTransactionLogSchema, BulkTransactionLogInsertSchema } from '../types/bulk-transaction-log.js';

export const ROUTE_PREFIX = '/bulk-transaction-log';

/**
 * List Bulk Transaction Log records.
 */
export async function listBulkTransactionLog(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(bulkTransactionLog).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Bulk Transaction Log by ID.
 */
export async function getBulkTransactionLog(db: any, id: string) {
  const rows = await db.select().from(bulkTransactionLog).where(eq(bulkTransactionLog.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Bulk Transaction Log.
 */
export async function createBulkTransactionLog(db: any, data: unknown) {
  const parsed = BulkTransactionLogInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(bulkTransactionLog).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Bulk Transaction Log.
 */
export async function updateBulkTransactionLog(db: any, id: string, data: unknown) {
  const parsed = BulkTransactionLogInsertSchema.partial().parse(data);
  await db.update(bulkTransactionLog).set({ ...parsed, modified: new Date() }).where(eq(bulkTransactionLog.id, id));
  return getBulkTransactionLog(db, id);
}

/**
 * Delete a Bulk Transaction Log by ID.
 */
export async function deleteBulkTransactionLog(db: any, id: string) {
  await db.delete(bulkTransactionLog).where(eq(bulkTransactionLog.id, id));
  return { deleted: true, id };
}
