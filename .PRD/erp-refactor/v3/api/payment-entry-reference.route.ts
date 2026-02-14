// CRUD API handlers for Payment Entry Reference
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { paymentEntryReference } from '../db/schema.js';
import { PaymentEntryReferenceSchema, PaymentEntryReferenceInsertSchema } from '../types/payment-entry-reference.js';

export const ROUTE_PREFIX = '/payment-entry-reference';

/**
 * List Payment Entry Reference records.
 */
export async function listPaymentEntryReference(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(paymentEntryReference).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Payment Entry Reference by ID.
 */
export async function getPaymentEntryReference(db: any, id: string) {
  const rows = await db.select().from(paymentEntryReference).where(eq(paymentEntryReference.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Payment Entry Reference.
 */
export async function createPaymentEntryReference(db: any, data: unknown) {
  const parsed = PaymentEntryReferenceInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(paymentEntryReference).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Payment Entry Reference.
 */
export async function updatePaymentEntryReference(db: any, id: string, data: unknown) {
  const parsed = PaymentEntryReferenceInsertSchema.partial().parse(data);
  await db.update(paymentEntryReference).set({ ...parsed, modified: new Date() }).where(eq(paymentEntryReference.id, id));
  return getPaymentEntryReference(db, id);
}

/**
 * Delete a Payment Entry Reference by ID.
 */
export async function deletePaymentEntryReference(db: any, id: string) {
  await db.delete(paymentEntryReference).where(eq(paymentEntryReference.id, id));
  return { deleted: true, id };
}
