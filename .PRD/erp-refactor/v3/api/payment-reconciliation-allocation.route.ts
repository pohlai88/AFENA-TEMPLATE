// CRUD API handlers for Payment Reconciliation Allocation
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { paymentReconciliationAllocation } from '../db/schema.js';
import { PaymentReconciliationAllocationSchema, PaymentReconciliationAllocationInsertSchema } from '../types/payment-reconciliation-allocation.js';

export const ROUTE_PREFIX = '/payment-reconciliation-allocation';

/**
 * List Payment Reconciliation Allocation records.
 */
export async function listPaymentReconciliationAllocation(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(paymentReconciliationAllocation).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Payment Reconciliation Allocation by ID.
 */
export async function getPaymentReconciliationAllocation(db: any, id: string) {
  const rows = await db.select().from(paymentReconciliationAllocation).where(eq(paymentReconciliationAllocation.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Payment Reconciliation Allocation.
 */
export async function createPaymentReconciliationAllocation(db: any, data: unknown) {
  const parsed = PaymentReconciliationAllocationInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(paymentReconciliationAllocation).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Payment Reconciliation Allocation.
 */
export async function updatePaymentReconciliationAllocation(db: any, id: string, data: unknown) {
  const parsed = PaymentReconciliationAllocationInsertSchema.partial().parse(data);
  await db.update(paymentReconciliationAllocation).set({ ...parsed, modified: new Date() }).where(eq(paymentReconciliationAllocation.id, id));
  return getPaymentReconciliationAllocation(db, id);
}

/**
 * Delete a Payment Reconciliation Allocation by ID.
 */
export async function deletePaymentReconciliationAllocation(db: any, id: string) {
  await db.delete(paymentReconciliationAllocation).where(eq(paymentReconciliationAllocation.id, id));
  return { deleted: true, id };
}
