// CRUD API handlers for Payment Entry
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { paymentEntry } from '../db/schema.js';
import { PaymentEntrySchema, PaymentEntryInsertSchema } from '../types/payment-entry.js';

export const ROUTE_PREFIX = '/payment-entry';

/**
 * List Payment Entry records.
 */
export async function listPaymentEntry(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(paymentEntry).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Payment Entry by ID.
 */
export async function getPaymentEntry(db: any, id: string) {
  const rows = await db.select().from(paymentEntry).where(eq(paymentEntry.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Payment Entry.
 */
export async function createPaymentEntry(db: any, data: unknown) {
  const parsed = PaymentEntryInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(paymentEntry).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Payment Entry.
 */
export async function updatePaymentEntry(db: any, id: string, data: unknown) {
  const parsed = PaymentEntryInsertSchema.partial().parse(data);
  await db.update(paymentEntry).set({ ...parsed, modified: new Date() }).where(eq(paymentEntry.id, id));
  return getPaymentEntry(db, id);
}

/**
 * Delete a Payment Entry by ID.
 */
export async function deletePaymentEntry(db: any, id: string) {
  await db.delete(paymentEntry).where(eq(paymentEntry.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Payment Entry (set docstatus = 1).
 */
export async function submitPaymentEntry(db: any, id: string) {
  await db.update(paymentEntry).set({ docstatus: 1, modified: new Date() }).where(eq(paymentEntry.id, id));
  return getPaymentEntry(db, id);
}

/**
 * Cancel a Payment Entry (set docstatus = 2).
 */
export async function cancelPaymentEntry(db: any, id: string) {
  await db.update(paymentEntry).set({ docstatus: 2, modified: new Date() }).where(eq(paymentEntry.id, id));
  return getPaymentEntry(db, id);
}
