// CRUD API handlers for Payment Terms Template Detail
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { paymentTermsTemplateDetail } from '../db/schema.js';
import { PaymentTermsTemplateDetailSchema, PaymentTermsTemplateDetailInsertSchema } from '../types/payment-terms-template-detail.js';

export const ROUTE_PREFIX = '/payment-terms-template-detail';

/**
 * List Payment Terms Template Detail records.
 */
export async function listPaymentTermsTemplateDetail(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(paymentTermsTemplateDetail).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Payment Terms Template Detail by ID.
 */
export async function getPaymentTermsTemplateDetail(db: any, id: string) {
  const rows = await db.select().from(paymentTermsTemplateDetail).where(eq(paymentTermsTemplateDetail.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Payment Terms Template Detail.
 */
export async function createPaymentTermsTemplateDetail(db: any, data: unknown) {
  const parsed = PaymentTermsTemplateDetailInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(paymentTermsTemplateDetail).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Payment Terms Template Detail.
 */
export async function updatePaymentTermsTemplateDetail(db: any, id: string, data: unknown) {
  const parsed = PaymentTermsTemplateDetailInsertSchema.partial().parse(data);
  await db.update(paymentTermsTemplateDetail).set({ ...parsed, modified: new Date() }).where(eq(paymentTermsTemplateDetail.id, id));
  return getPaymentTermsTemplateDetail(db, id);
}

/**
 * Delete a Payment Terms Template Detail by ID.
 */
export async function deletePaymentTermsTemplateDetail(db: any, id: string) {
  await db.delete(paymentTermsTemplateDetail).where(eq(paymentTermsTemplateDetail.id, id));
  return { deleted: true, id };
}
