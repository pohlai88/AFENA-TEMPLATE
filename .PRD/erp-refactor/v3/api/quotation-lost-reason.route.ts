// CRUD API handlers for Quotation Lost Reason
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { quotationLostReason } from '../db/schema.js';
import { QuotationLostReasonSchema, QuotationLostReasonInsertSchema } from '../types/quotation-lost-reason.js';

export const ROUTE_PREFIX = '/quotation-lost-reason';

/**
 * List Quotation Lost Reason records.
 */
export async function listQuotationLostReason(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(quotationLostReason).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Quotation Lost Reason by ID.
 */
export async function getQuotationLostReason(db: any, id: string) {
  const rows = await db.select().from(quotationLostReason).where(eq(quotationLostReason.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Quotation Lost Reason.
 */
export async function createQuotationLostReason(db: any, data: unknown) {
  const parsed = QuotationLostReasonInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(quotationLostReason).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Quotation Lost Reason.
 */
export async function updateQuotationLostReason(db: any, id: string, data: unknown) {
  const parsed = QuotationLostReasonInsertSchema.partial().parse(data);
  await db.update(quotationLostReason).set({ ...parsed, modified: new Date() }).where(eq(quotationLostReason.id, id));
  return getQuotationLostReason(db, id);
}

/**
 * Delete a Quotation Lost Reason by ID.
 */
export async function deleteQuotationLostReason(db: any, id: string) {
  await db.delete(quotationLostReason).where(eq(quotationLostReason.id, id));
  return { deleted: true, id };
}
