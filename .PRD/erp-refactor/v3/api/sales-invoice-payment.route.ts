// CRUD API handlers for Sales Invoice Payment
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { salesInvoicePayment } from '../db/schema.js';
import { SalesInvoicePaymentSchema, SalesInvoicePaymentInsertSchema } from '../types/sales-invoice-payment.js';

export const ROUTE_PREFIX = '/sales-invoice-payment';

/**
 * List Sales Invoice Payment records.
 */
export async function listSalesInvoicePayment(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(salesInvoicePayment).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Sales Invoice Payment by ID.
 */
export async function getSalesInvoicePayment(db: any, id: string) {
  const rows = await db.select().from(salesInvoicePayment).where(eq(salesInvoicePayment.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Sales Invoice Payment.
 */
export async function createSalesInvoicePayment(db: any, data: unknown) {
  const parsed = SalesInvoicePaymentInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(salesInvoicePayment).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Sales Invoice Payment.
 */
export async function updateSalesInvoicePayment(db: any, id: string, data: unknown) {
  const parsed = SalesInvoicePaymentInsertSchema.partial().parse(data);
  await db.update(salesInvoicePayment).set({ ...parsed, modified: new Date() }).where(eq(salesInvoicePayment.id, id));
  return getSalesInvoicePayment(db, id);
}

/**
 * Delete a Sales Invoice Payment by ID.
 */
export async function deleteSalesInvoicePayment(db: any, id: string) {
  await db.delete(salesInvoicePayment).where(eq(salesInvoicePayment.id, id));
  return { deleted: true, id };
}
