// CRUD API handlers for Payment Schedule
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { paymentSchedule } from '../db/schema.js';
import { PaymentScheduleSchema, PaymentScheduleInsertSchema } from '../types/payment-schedule.js';

export const ROUTE_PREFIX = '/payment-schedule';

/**
 * List Payment Schedule records.
 */
export async function listPaymentSchedule(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(paymentSchedule).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Payment Schedule by ID.
 */
export async function getPaymentSchedule(db: any, id: string) {
  const rows = await db.select().from(paymentSchedule).where(eq(paymentSchedule.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Payment Schedule.
 */
export async function createPaymentSchedule(db: any, data: unknown) {
  const parsed = PaymentScheduleInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(paymentSchedule).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Payment Schedule.
 */
export async function updatePaymentSchedule(db: any, id: string, data: unknown) {
  const parsed = PaymentScheduleInsertSchema.partial().parse(data);
  await db.update(paymentSchedule).set({ ...parsed, modified: new Date() }).where(eq(paymentSchedule.id, id));
  return getPaymentSchedule(db, id);
}

/**
 * Delete a Payment Schedule by ID.
 */
export async function deletePaymentSchedule(db: any, id: string) {
  await db.delete(paymentSchedule).where(eq(paymentSchedule.id, id));
  return { deleted: true, id };
}
