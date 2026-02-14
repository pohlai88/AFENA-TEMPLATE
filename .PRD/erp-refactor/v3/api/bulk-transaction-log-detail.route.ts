// CRUD API handlers for Bulk Transaction Log Detail
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { bulkTransactionLogDetail } from '../db/schema.js';
import { BulkTransactionLogDetailSchema, BulkTransactionLogDetailInsertSchema } from '../types/bulk-transaction-log-detail.js';

export const ROUTE_PREFIX = '/bulk-transaction-log-detail';

/**
 * List Bulk Transaction Log Detail records.
 */
export async function listBulkTransactionLogDetail(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(bulkTransactionLogDetail).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Bulk Transaction Log Detail by ID.
 */
export async function getBulkTransactionLogDetail(db: any, id: string) {
  const rows = await db.select().from(bulkTransactionLogDetail).where(eq(bulkTransactionLogDetail.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Bulk Transaction Log Detail.
 */
export async function createBulkTransactionLogDetail(db: any, data: unknown) {
  const parsed = BulkTransactionLogDetailInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(bulkTransactionLogDetail).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Bulk Transaction Log Detail.
 */
export async function updateBulkTransactionLogDetail(db: any, id: string, data: unknown) {
  const parsed = BulkTransactionLogDetailInsertSchema.partial().parse(data);
  await db.update(bulkTransactionLogDetail).set({ ...parsed, modified: new Date() }).where(eq(bulkTransactionLogDetail.id, id));
  return getBulkTransactionLogDetail(db, id);
}

/**
 * Delete a Bulk Transaction Log Detail by ID.
 */
export async function deleteBulkTransactionLogDetail(db: any, id: string) {
  await db.delete(bulkTransactionLogDetail).where(eq(bulkTransactionLogDetail.id, id));
  return { deleted: true, id };
}
