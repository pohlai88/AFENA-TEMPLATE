// CRUD API handlers for Payment Reconciliation Invoice
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { paymentReconciliationInvoice } from '../db/schema.js';
import { PaymentReconciliationInvoiceSchema, PaymentReconciliationInvoiceInsertSchema } from '../types/payment-reconciliation-invoice.js';

export const ROUTE_PREFIX = '/payment-reconciliation-invoice';

/**
 * List Payment Reconciliation Invoice records.
 */
export async function listPaymentReconciliationInvoice(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(paymentReconciliationInvoice).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Payment Reconciliation Invoice by ID.
 */
export async function getPaymentReconciliationInvoice(db: any, id: string) {
  const rows = await db.select().from(paymentReconciliationInvoice).where(eq(paymentReconciliationInvoice.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Payment Reconciliation Invoice.
 */
export async function createPaymentReconciliationInvoice(db: any, data: unknown) {
  const parsed = PaymentReconciliationInvoiceInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(paymentReconciliationInvoice).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Payment Reconciliation Invoice.
 */
export async function updatePaymentReconciliationInvoice(db: any, id: string, data: unknown) {
  const parsed = PaymentReconciliationInvoiceInsertSchema.partial().parse(data);
  await db.update(paymentReconciliationInvoice).set({ ...parsed, modified: new Date() }).where(eq(paymentReconciliationInvoice.id, id));
  return getPaymentReconciliationInvoice(db, id);
}

/**
 * Delete a Payment Reconciliation Invoice by ID.
 */
export async function deletePaymentReconciliationInvoice(db: any, id: string) {
  await db.delete(paymentReconciliationInvoice).where(eq(paymentReconciliationInvoice.id, id));
  return { deleted: true, id };
}
