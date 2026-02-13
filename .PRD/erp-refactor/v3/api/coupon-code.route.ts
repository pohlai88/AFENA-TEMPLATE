// CRUD API handlers for Coupon Code
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { couponCode } from '../db/schema.js';
import { CouponCodeSchema, CouponCodeInsertSchema } from '../types/coupon-code.js';

export const ROUTE_PREFIX = '/coupon-code';

/**
 * List Coupon Code records.
 */
export async function listCouponCode(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(couponCode).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Coupon Code by ID.
 */
export async function getCouponCode(db: any, id: string) {
  const rows = await db.select().from(couponCode).where(eq(couponCode.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Coupon Code.
 */
export async function createCouponCode(db: any, data: unknown) {
  const parsed = CouponCodeInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(couponCode).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Coupon Code.
 */
export async function updateCouponCode(db: any, id: string, data: unknown) {
  const parsed = CouponCodeInsertSchema.partial().parse(data);
  await db.update(couponCode).set({ ...parsed, modified: new Date() }).where(eq(couponCode.id, id));
  return getCouponCode(db, id);
}

/**
 * Delete a Coupon Code by ID.
 */
export async function deleteCouponCode(db: any, id: string) {
  await db.delete(couponCode).where(eq(couponCode.id, id));
  return { deleted: true, id };
}
