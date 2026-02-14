// CRUD API handlers for Process Period Closing Voucher
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { processPeriodClosingVoucher } from '../db/schema.js';
import { ProcessPeriodClosingVoucherSchema, ProcessPeriodClosingVoucherInsertSchema } from '../types/process-period-closing-voucher.js';

export const ROUTE_PREFIX = '/process-period-closing-voucher';

/**
 * List Process Period Closing Voucher records.
 */
export async function listProcessPeriodClosingVoucher(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(processPeriodClosingVoucher).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Process Period Closing Voucher by ID.
 */
export async function getProcessPeriodClosingVoucher(db: any, id: string) {
  const rows = await db.select().from(processPeriodClosingVoucher).where(eq(processPeriodClosingVoucher.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Process Period Closing Voucher.
 */
export async function createProcessPeriodClosingVoucher(db: any, data: unknown) {
  const parsed = ProcessPeriodClosingVoucherInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(processPeriodClosingVoucher).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Process Period Closing Voucher.
 */
export async function updateProcessPeriodClosingVoucher(db: any, id: string, data: unknown) {
  const parsed = ProcessPeriodClosingVoucherInsertSchema.partial().parse(data);
  await db.update(processPeriodClosingVoucher).set({ ...parsed, modified: new Date() }).where(eq(processPeriodClosingVoucher.id, id));
  return getProcessPeriodClosingVoucher(db, id);
}

/**
 * Delete a Process Period Closing Voucher by ID.
 */
export async function deleteProcessPeriodClosingVoucher(db: any, id: string) {
  await db.delete(processPeriodClosingVoucher).where(eq(processPeriodClosingVoucher.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Process Period Closing Voucher (set docstatus = 1).
 */
export async function submitProcessPeriodClosingVoucher(db: any, id: string) {
  await db.update(processPeriodClosingVoucher).set({ docstatus: 1, modified: new Date() }).where(eq(processPeriodClosingVoucher.id, id));
  return getProcessPeriodClosingVoucher(db, id);
}

/**
 * Cancel a Process Period Closing Voucher (set docstatus = 2).
 */
export async function cancelProcessPeriodClosingVoucher(db: any, id: string) {
  await db.update(processPeriodClosingVoucher).set({ docstatus: 2, modified: new Date() }).where(eq(processPeriodClosingVoucher.id, id));
  return getProcessPeriodClosingVoucher(db, id);
}
