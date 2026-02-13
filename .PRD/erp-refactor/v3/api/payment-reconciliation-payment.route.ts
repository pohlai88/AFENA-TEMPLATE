// CRUD API handlers for Payment Reconciliation Payment
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { paymentReconciliationPayment } from '../db/schema.js';
import { PaymentReconciliationPaymentSchema, PaymentReconciliationPaymentInsertSchema } from '../types/payment-reconciliation-payment.js';

export const ROUTE_PREFIX = '/payment-reconciliation-payment';

/**
 * List Payment Reconciliation Payment records.
 */
export async function listPaymentReconciliationPayment(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(paymentReconciliationPayment).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Payment Reconciliation Payment by ID.
 */
export async function getPaymentReconciliationPayment(db: any, id: string) {
  const rows = await db.select().from(paymentReconciliationPayment).where(eq(paymentReconciliationPayment.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Payment Reconciliation Payment.
 */
export async function createPaymentReconciliationPayment(db: any, data: unknown) {
  const parsed = PaymentReconciliationPaymentInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(paymentReconciliationPayment).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Payment Reconciliation Payment.
 */
export async function updatePaymentReconciliationPayment(db: any, id: string, data: unknown) {
  const parsed = PaymentReconciliationPaymentInsertSchema.partial().parse(data);
  await db.update(paymentReconciliationPayment).set({ ...parsed, modified: new Date() }).where(eq(paymentReconciliationPayment.id, id));
  return getPaymentReconciliationPayment(db, id);
}

/**
 * Delete a Payment Reconciliation Payment by ID.
 */
export async function deletePaymentReconciliationPayment(db: any, id: string) {
  await db.delete(paymentReconciliationPayment).where(eq(paymentReconciliationPayment.id, id));
  return { deleted: true, id };
}
