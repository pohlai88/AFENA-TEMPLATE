// CRUD API handlers for Payment Term
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { paymentTerm } from '../db/schema.js';
import { PaymentTermSchema, PaymentTermInsertSchema } from '../types/payment-term.js';

export const ROUTE_PREFIX = '/payment-term';

/**
 * List Payment Term records.
 */
export async function listPaymentTerm(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(paymentTerm).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Payment Term by ID.
 */
export async function getPaymentTerm(db: any, id: string) {
  const rows = await db.select().from(paymentTerm).where(eq(paymentTerm.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Payment Term.
 */
export async function createPaymentTerm(db: any, data: unknown) {
  const parsed = PaymentTermInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(paymentTerm).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Payment Term.
 */
export async function updatePaymentTerm(db: any, id: string, data: unknown) {
  const parsed = PaymentTermInsertSchema.partial().parse(data);
  await db.update(paymentTerm).set({ ...parsed, modified: new Date() }).where(eq(paymentTerm.id, id));
  return getPaymentTerm(db, id);
}

/**
 * Delete a Payment Term by ID.
 */
export async function deletePaymentTerm(db: any, id: string) {
  await db.delete(paymentTerm).where(eq(paymentTerm.id, id));
  return { deleted: true, id };
}
