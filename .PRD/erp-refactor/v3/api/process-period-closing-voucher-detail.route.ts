// CRUD API handlers for Process Period Closing Voucher Detail
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { processPeriodClosingVoucherDetail } from '../db/schema.js';
import { ProcessPeriodClosingVoucherDetailSchema, ProcessPeriodClosingVoucherDetailInsertSchema } from '../types/process-period-closing-voucher-detail.js';

export const ROUTE_PREFIX = '/process-period-closing-voucher-detail';

/**
 * List Process Period Closing Voucher Detail records.
 */
export async function listProcessPeriodClosingVoucherDetail(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(processPeriodClosingVoucherDetail).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Process Period Closing Voucher Detail by ID.
 */
export async function getProcessPeriodClosingVoucherDetail(db: any, id: string) {
  const rows = await db.select().from(processPeriodClosingVoucherDetail).where(eq(processPeriodClosingVoucherDetail.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Process Period Closing Voucher Detail.
 */
export async function createProcessPeriodClosingVoucherDetail(db: any, data: unknown) {
  const parsed = ProcessPeriodClosingVoucherDetailInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(processPeriodClosingVoucherDetail).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Process Period Closing Voucher Detail.
 */
export async function updateProcessPeriodClosingVoucherDetail(db: any, id: string, data: unknown) {
  const parsed = ProcessPeriodClosingVoucherDetailInsertSchema.partial().parse(data);
  await db.update(processPeriodClosingVoucherDetail).set({ ...parsed, modified: new Date() }).where(eq(processPeriodClosingVoucherDetail.id, id));
  return getProcessPeriodClosingVoucherDetail(db, id);
}

/**
 * Delete a Process Period Closing Voucher Detail by ID.
 */
export async function deleteProcessPeriodClosingVoucherDetail(db: any, id: string) {
  await db.delete(processPeriodClosingVoucherDetail).where(eq(processPeriodClosingVoucherDetail.id, id));
  return { deleted: true, id };
}
