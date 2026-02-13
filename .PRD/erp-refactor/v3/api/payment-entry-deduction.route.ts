// CRUD API handlers for Payment Entry Deduction
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { paymentEntryDeduction } from '../db/schema.js';
import { PaymentEntryDeductionSchema, PaymentEntryDeductionInsertSchema } from '../types/payment-entry-deduction.js';

export const ROUTE_PREFIX = '/payment-entry-deduction';

/**
 * List Payment Entry Deduction records.
 */
export async function listPaymentEntryDeduction(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(paymentEntryDeduction).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Payment Entry Deduction by ID.
 */
export async function getPaymentEntryDeduction(db: any, id: string) {
  const rows = await db.select().from(paymentEntryDeduction).where(eq(paymentEntryDeduction.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Payment Entry Deduction.
 */
export async function createPaymentEntryDeduction(db: any, data: unknown) {
  const parsed = PaymentEntryDeductionInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(paymentEntryDeduction).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Payment Entry Deduction.
 */
export async function updatePaymentEntryDeduction(db: any, id: string, data: unknown) {
  const parsed = PaymentEntryDeductionInsertSchema.partial().parse(data);
  await db.update(paymentEntryDeduction).set({ ...parsed, modified: new Date() }).where(eq(paymentEntryDeduction.id, id));
  return getPaymentEntryDeduction(db, id);
}

/**
 * Delete a Payment Entry Deduction by ID.
 */
export async function deletePaymentEntryDeduction(db: any, id: string) {
  await db.delete(paymentEntryDeduction).where(eq(paymentEntryDeduction.id, id));
  return { deleted: true, id };
}
