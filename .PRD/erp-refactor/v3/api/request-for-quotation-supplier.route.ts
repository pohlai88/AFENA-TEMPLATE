// CRUD API handlers for Request for Quotation Supplier
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { requestForQuotationSupplier } from '../db/schema.js';
import { RequestForQuotationSupplierSchema, RequestForQuotationSupplierInsertSchema } from '../types/request-for-quotation-supplier.js';

export const ROUTE_PREFIX = '/request-for-quotation-supplier';

/**
 * List Request for Quotation Supplier records.
 */
export async function listRequestForQuotationSupplier(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(requestForQuotationSupplier).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Request for Quotation Supplier by ID.
 */
export async function getRequestForQuotationSupplier(db: any, id: string) {
  const rows = await db.select().from(requestForQuotationSupplier).where(eq(requestForQuotationSupplier.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Request for Quotation Supplier.
 */
export async function createRequestForQuotationSupplier(db: any, data: unknown) {
  const parsed = RequestForQuotationSupplierInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(requestForQuotationSupplier).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Request for Quotation Supplier.
 */
export async function updateRequestForQuotationSupplier(db: any, id: string, data: unknown) {
  const parsed = RequestForQuotationSupplierInsertSchema.partial().parse(data);
  await db.update(requestForQuotationSupplier).set({ ...parsed, modified: new Date() }).where(eq(requestForQuotationSupplier.id, id));
  return getRequestForQuotationSupplier(db, id);
}

/**
 * Delete a Request for Quotation Supplier by ID.
 */
export async function deleteRequestForQuotationSupplier(db: any, id: string) {
  await db.delete(requestForQuotationSupplier).where(eq(requestForQuotationSupplier.id, id));
  return { deleted: true, id };
}
