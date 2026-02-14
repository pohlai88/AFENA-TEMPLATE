// CRUD API handlers for Payment Reconciliation
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { paymentReconciliation } from '../db/schema.js';
import { PaymentReconciliationSchema, PaymentReconciliationInsertSchema } from '../types/payment-reconciliation.js';

export const ROUTE_PREFIX = '/payment-reconciliation';

/**
 * List Payment Reconciliation records.
 */
export async function listPaymentReconciliation(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(paymentReconciliation).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Payment Reconciliation by ID.
 */
export async function getPaymentReconciliation(db: any, id: string) {
  const rows = await db.select().from(paymentReconciliation).where(eq(paymentReconciliation.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Payment Reconciliation.
 */
export async function createPaymentReconciliation(db: any, data: unknown) {
  const parsed = PaymentReconciliationInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(paymentReconciliation).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Payment Reconciliation.
 */
export async function updatePaymentReconciliation(db: any, id: string, data: unknown) {
  const parsed = PaymentReconciliationInsertSchema.partial().parse(data);
  await db.update(paymentReconciliation).set({ ...parsed, modified: new Date() }).where(eq(paymentReconciliation.id, id));
  return getPaymentReconciliation(db, id);
}

/**
 * Delete a Payment Reconciliation by ID.
 */
export async function deletePaymentReconciliation(db: any, id: string) {
  await db.delete(paymentReconciliation).where(eq(paymentReconciliation.id, id));
  return { deleted: true, id };
}
