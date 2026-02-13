// CRUD API handlers for Period Closing Voucher
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { periodClosingVoucher } from '../db/schema.js';
import { PeriodClosingVoucherSchema, PeriodClosingVoucherInsertSchema } from '../types/period-closing-voucher.js';

export const ROUTE_PREFIX = '/period-closing-voucher';

/**
 * List Period Closing Voucher records.
 */
export async function listPeriodClosingVoucher(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(periodClosingVoucher).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Period Closing Voucher by ID.
 */
export async function getPeriodClosingVoucher(db: any, id: string) {
  const rows = await db.select().from(periodClosingVoucher).where(eq(periodClosingVoucher.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Period Closing Voucher.
 */
export async function createPeriodClosingVoucher(db: any, data: unknown) {
  const parsed = PeriodClosingVoucherInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(periodClosingVoucher).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Period Closing Voucher.
 */
export async function updatePeriodClosingVoucher(db: any, id: string, data: unknown) {
  const parsed = PeriodClosingVoucherInsertSchema.partial().parse(data);
  await db.update(periodClosingVoucher).set({ ...parsed, modified: new Date() }).where(eq(periodClosingVoucher.id, id));
  return getPeriodClosingVoucher(db, id);
}

/**
 * Delete a Period Closing Voucher by ID.
 */
export async function deletePeriodClosingVoucher(db: any, id: string) {
  await db.delete(periodClosingVoucher).where(eq(periodClosingVoucher.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Period Closing Voucher (set docstatus = 1).
 */
export async function submitPeriodClosingVoucher(db: any, id: string) {
  await db.update(periodClosingVoucher).set({ docstatus: 1, modified: new Date() }).where(eq(periodClosingVoucher.id, id));
  return getPeriodClosingVoucher(db, id);
}

/**
 * Cancel a Period Closing Voucher (set docstatus = 2).
 */
export async function cancelPeriodClosingVoucher(db: any, id: string) {
  await db.update(periodClosingVoucher).set({ docstatus: 2, modified: new Date() }).where(eq(periodClosingVoucher.id, id));
  return getPeriodClosingVoucher(db, id);
}
