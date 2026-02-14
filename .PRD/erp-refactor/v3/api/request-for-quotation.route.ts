// CRUD API handlers for Request for Quotation
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { requestForQuotation } from '../db/schema.js';
import { RequestForQuotationSchema, RequestForQuotationInsertSchema } from '../types/request-for-quotation.js';

export const ROUTE_PREFIX = '/request-for-quotation';

/**
 * List Request for Quotation records.
 */
export async function listRequestForQuotation(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(requestForQuotation).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Request for Quotation by ID.
 */
export async function getRequestForQuotation(db: any, id: string) {
  const rows = await db.select().from(requestForQuotation).where(eq(requestForQuotation.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Request for Quotation.
 */
export async function createRequestForQuotation(db: any, data: unknown) {
  const parsed = RequestForQuotationInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(requestForQuotation).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Request for Quotation.
 */
export async function updateRequestForQuotation(db: any, id: string, data: unknown) {
  const parsed = RequestForQuotationInsertSchema.partial().parse(data);
  await db.update(requestForQuotation).set({ ...parsed, modified: new Date() }).where(eq(requestForQuotation.id, id));
  return getRequestForQuotation(db, id);
}

/**
 * Delete a Request for Quotation by ID.
 */
export async function deleteRequestForQuotation(db: any, id: string) {
  await db.delete(requestForQuotation).where(eq(requestForQuotation.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Request for Quotation (set docstatus = 1).
 */
export async function submitRequestForQuotation(db: any, id: string) {
  await db.update(requestForQuotation).set({ docstatus: 1, modified: new Date() }).where(eq(requestForQuotation.id, id));
  return getRequestForQuotation(db, id);
}

/**
 * Cancel a Request for Quotation (set docstatus = 2).
 */
export async function cancelRequestForQuotation(db: any, id: string) {
  await db.update(requestForQuotation).set({ docstatus: 2, modified: new Date() }).where(eq(requestForQuotation.id, id));
  return getRequestForQuotation(db, id);
}
