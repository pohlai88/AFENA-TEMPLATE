// CRUD API handlers for Payment Terms Template
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { paymentTermsTemplate } from '../db/schema.js';
import { PaymentTermsTemplateSchema, PaymentTermsTemplateInsertSchema } from '../types/payment-terms-template.js';

export const ROUTE_PREFIX = '/payment-terms-template';

/**
 * List Payment Terms Template records.
 */
export async function listPaymentTermsTemplate(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(paymentTermsTemplate).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Payment Terms Template by ID.
 */
export async function getPaymentTermsTemplate(db: any, id: string) {
  const rows = await db.select().from(paymentTermsTemplate).where(eq(paymentTermsTemplate.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Payment Terms Template.
 */
export async function createPaymentTermsTemplate(db: any, data: unknown) {
  const parsed = PaymentTermsTemplateInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(paymentTermsTemplate).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Payment Terms Template.
 */
export async function updatePaymentTermsTemplate(db: any, id: string, data: unknown) {
  const parsed = PaymentTermsTemplateInsertSchema.partial().parse(data);
  await db.update(paymentTermsTemplate).set({ ...parsed, modified: new Date() }).where(eq(paymentTermsTemplate.id, id));
  return getPaymentTermsTemplate(db, id);
}

/**
 * Delete a Payment Terms Template by ID.
 */
export async function deletePaymentTermsTemplate(db: any, id: string) {
  await db.delete(paymentTermsTemplate).where(eq(paymentTermsTemplate.id, id));
  return { deleted: true, id };
}
