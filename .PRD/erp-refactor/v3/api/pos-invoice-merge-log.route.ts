// CRUD API handlers for POS Invoice Merge Log
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { posInvoiceMergeLog } from '../db/schema.js';
import { PosInvoiceMergeLogSchema, PosInvoiceMergeLogInsertSchema } from '../types/pos-invoice-merge-log.js';

export const ROUTE_PREFIX = '/pos-invoice-merge-log';

/**
 * List POS Invoice Merge Log records.
 */
export async function listPosInvoiceMergeLog(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(posInvoiceMergeLog).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single POS Invoice Merge Log by ID.
 */
export async function getPosInvoiceMergeLog(db: any, id: string) {
  const rows = await db.select().from(posInvoiceMergeLog).where(eq(posInvoiceMergeLog.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new POS Invoice Merge Log.
 */
export async function createPosInvoiceMergeLog(db: any, data: unknown) {
  const parsed = PosInvoiceMergeLogInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(posInvoiceMergeLog).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing POS Invoice Merge Log.
 */
export async function updatePosInvoiceMergeLog(db: any, id: string, data: unknown) {
  const parsed = PosInvoiceMergeLogInsertSchema.partial().parse(data);
  await db.update(posInvoiceMergeLog).set({ ...parsed, modified: new Date() }).where(eq(posInvoiceMergeLog.id, id));
  return getPosInvoiceMergeLog(db, id);
}

/**
 * Delete a POS Invoice Merge Log by ID.
 */
export async function deletePosInvoiceMergeLog(db: any, id: string) {
  await db.delete(posInvoiceMergeLog).where(eq(posInvoiceMergeLog.id, id));
  return { deleted: true, id };
}

/**
 * Submit a POS Invoice Merge Log (set docstatus = 1).
 */
export async function submitPosInvoiceMergeLog(db: any, id: string) {
  await db.update(posInvoiceMergeLog).set({ docstatus: 1, modified: new Date() }).where(eq(posInvoiceMergeLog.id, id));
  return getPosInvoiceMergeLog(db, id);
}

/**
 * Cancel a POS Invoice Merge Log (set docstatus = 2).
 */
export async function cancelPosInvoiceMergeLog(db: any, id: string) {
  await db.update(posInvoiceMergeLog).set({ docstatus: 2, modified: new Date() }).where(eq(posInvoiceMergeLog.id, id));
  return getPosInvoiceMergeLog(db, id);
}
