// CRUD API handlers for Payment Order Reference
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { paymentOrderReference } from '../db/schema.js';
import { PaymentOrderReferenceSchema, PaymentOrderReferenceInsertSchema } from '../types/payment-order-reference.js';

export const ROUTE_PREFIX = '/payment-order-reference';

/**
 * List Payment Order Reference records.
 */
export async function listPaymentOrderReference(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(paymentOrderReference).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Payment Order Reference by ID.
 */
export async function getPaymentOrderReference(db: any, id: string) {
  const rows = await db.select().from(paymentOrderReference).where(eq(paymentOrderReference.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Payment Order Reference.
 */
export async function createPaymentOrderReference(db: any, data: unknown) {
  const parsed = PaymentOrderReferenceInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(paymentOrderReference).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Payment Order Reference.
 */
export async function updatePaymentOrderReference(db: any, id: string, data: unknown) {
  const parsed = PaymentOrderReferenceInsertSchema.partial().parse(data);
  await db.update(paymentOrderReference).set({ ...parsed, modified: new Date() }).where(eq(paymentOrderReference.id, id));
  return getPaymentOrderReference(db, id);
}

/**
 * Delete a Payment Order Reference by ID.
 */
export async function deletePaymentOrderReference(db: any, id: string) {
  await db.delete(paymentOrderReference).where(eq(paymentOrderReference.id, id));
  return { deleted: true, id };
}
