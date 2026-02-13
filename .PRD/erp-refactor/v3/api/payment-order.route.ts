// CRUD API handlers for Payment Order
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { paymentOrder } from '../db/schema.js';
import { PaymentOrderSchema, PaymentOrderInsertSchema } from '../types/payment-order.js';

export const ROUTE_PREFIX = '/payment-order';

/**
 * List Payment Order records.
 */
export async function listPaymentOrder(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(paymentOrder).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Payment Order by ID.
 */
export async function getPaymentOrder(db: any, id: string) {
  const rows = await db.select().from(paymentOrder).where(eq(paymentOrder.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Payment Order.
 */
export async function createPaymentOrder(db: any, data: unknown) {
  const parsed = PaymentOrderInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(paymentOrder).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Payment Order.
 */
export async function updatePaymentOrder(db: any, id: string, data: unknown) {
  const parsed = PaymentOrderInsertSchema.partial().parse(data);
  await db.update(paymentOrder).set({ ...parsed, modified: new Date() }).where(eq(paymentOrder.id, id));
  return getPaymentOrder(db, id);
}

/**
 * Delete a Payment Order by ID.
 */
export async function deletePaymentOrder(db: any, id: string) {
  await db.delete(paymentOrder).where(eq(paymentOrder.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Payment Order (set docstatus = 1).
 */
export async function submitPaymentOrder(db: any, id: string) {
  await db.update(paymentOrder).set({ docstatus: 1, modified: new Date() }).where(eq(paymentOrder.id, id));
  return getPaymentOrder(db, id);
}

/**
 * Cancel a Payment Order (set docstatus = 2).
 */
export async function cancelPaymentOrder(db: any, id: string) {
  await db.update(paymentOrder).set({ docstatus: 2, modified: new Date() }).where(eq(paymentOrder.id, id));
  return getPaymentOrder(db, id);
}
