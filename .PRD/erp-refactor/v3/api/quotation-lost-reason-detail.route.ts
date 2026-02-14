// CRUD API handlers for Quotation Lost Reason Detail
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { quotationLostReasonDetail } from '../db/schema.js';
import { QuotationLostReasonDetailSchema, QuotationLostReasonDetailInsertSchema } from '../types/quotation-lost-reason-detail.js';

export const ROUTE_PREFIX = '/quotation-lost-reason-detail';

/**
 * List Quotation Lost Reason Detail records.
 */
export async function listQuotationLostReasonDetail(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(quotationLostReasonDetail).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Quotation Lost Reason Detail by ID.
 */
export async function getQuotationLostReasonDetail(db: any, id: string) {
  const rows = await db.select().from(quotationLostReasonDetail).where(eq(quotationLostReasonDetail.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Quotation Lost Reason Detail.
 */
export async function createQuotationLostReasonDetail(db: any, data: unknown) {
  const parsed = QuotationLostReasonDetailInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(quotationLostReasonDetail).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Quotation Lost Reason Detail.
 */
export async function updateQuotationLostReasonDetail(db: any, id: string, data: unknown) {
  const parsed = QuotationLostReasonDetailInsertSchema.partial().parse(data);
  await db.update(quotationLostReasonDetail).set({ ...parsed, modified: new Date() }).where(eq(quotationLostReasonDetail.id, id));
  return getQuotationLostReasonDetail(db, id);
}

/**
 * Delete a Quotation Lost Reason Detail by ID.
 */
export async function deleteQuotationLostReasonDetail(db: any, id: string) {
  await db.delete(quotationLostReasonDetail).where(eq(quotationLostReasonDetail.id, id));
  return { deleted: true, id };
}
