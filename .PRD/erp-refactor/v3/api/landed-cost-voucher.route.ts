// CRUD API handlers for Landed Cost Voucher
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { landedCostVoucher } from '../db/schema.js';
import { LandedCostVoucherSchema, LandedCostVoucherInsertSchema } from '../types/landed-cost-voucher.js';

export const ROUTE_PREFIX = '/landed-cost-voucher';

/**
 * List Landed Cost Voucher records.
 */
export async function listLandedCostVoucher(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(landedCostVoucher).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Landed Cost Voucher by ID.
 */
export async function getLandedCostVoucher(db: any, id: string) {
  const rows = await db.select().from(landedCostVoucher).where(eq(landedCostVoucher.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Landed Cost Voucher.
 */
export async function createLandedCostVoucher(db: any, data: unknown) {
  const parsed = LandedCostVoucherInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(landedCostVoucher).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Landed Cost Voucher.
 */
export async function updateLandedCostVoucher(db: any, id: string, data: unknown) {
  const parsed = LandedCostVoucherInsertSchema.partial().parse(data);
  await db.update(landedCostVoucher).set({ ...parsed, modified: new Date() }).where(eq(landedCostVoucher.id, id));
  return getLandedCostVoucher(db, id);
}

/**
 * Delete a Landed Cost Voucher by ID.
 */
export async function deleteLandedCostVoucher(db: any, id: string) {
  await db.delete(landedCostVoucher).where(eq(landedCostVoucher.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Landed Cost Voucher (set docstatus = 1).
 */
export async function submitLandedCostVoucher(db: any, id: string) {
  await db.update(landedCostVoucher).set({ docstatus: 1, modified: new Date() }).where(eq(landedCostVoucher.id, id));
  return getLandedCostVoucher(db, id);
}

/**
 * Cancel a Landed Cost Voucher (set docstatus = 2).
 */
export async function cancelLandedCostVoucher(db: any, id: string) {
  await db.update(landedCostVoucher).set({ docstatus: 2, modified: new Date() }).where(eq(landedCostVoucher.id, id));
  return getLandedCostVoucher(db, id);
}
