// CRUD API handlers for Payment Request
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { paymentRequest } from '../db/schema.js';
import { PaymentRequestSchema, PaymentRequestInsertSchema } from '../types/payment-request.js';

export const ROUTE_PREFIX = '/payment-request';

/**
 * List Payment Request records.
 */
export async function listPaymentRequest(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(paymentRequest).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Payment Request by ID.
 */
export async function getPaymentRequest(db: any, id: string) {
  const rows = await db.select().from(paymentRequest).where(eq(paymentRequest.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Payment Request.
 */
export async function createPaymentRequest(db: any, data: unknown) {
  const parsed = PaymentRequestInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(paymentRequest).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Payment Request.
 */
export async function updatePaymentRequest(db: any, id: string, data: unknown) {
  const parsed = PaymentRequestInsertSchema.partial().parse(data);
  await db.update(paymentRequest).set({ ...parsed, modified: new Date() }).where(eq(paymentRequest.id, id));
  return getPaymentRequest(db, id);
}

/**
 * Delete a Payment Request by ID.
 */
export async function deletePaymentRequest(db: any, id: string) {
  await db.delete(paymentRequest).where(eq(paymentRequest.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Payment Request (set docstatus = 1).
 */
export async function submitPaymentRequest(db: any, id: string) {
  await db.update(paymentRequest).set({ docstatus: 1, modified: new Date() }).where(eq(paymentRequest.id, id));
  return getPaymentRequest(db, id);
}

/**
 * Cancel a Payment Request (set docstatus = 2).
 */
export async function cancelPaymentRequest(db: any, id: string) {
  await db.update(paymentRequest).set({ docstatus: 2, modified: new Date() }).where(eq(paymentRequest.id, id));
  return getPaymentRequest(db, id);
}
