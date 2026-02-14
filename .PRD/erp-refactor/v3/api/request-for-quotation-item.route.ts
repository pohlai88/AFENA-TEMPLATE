// CRUD API handlers for Request for Quotation Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { requestForQuotationItem } from '../db/schema.js';
import { RequestForQuotationItemSchema, RequestForQuotationItemInsertSchema } from '../types/request-for-quotation-item.js';

export const ROUTE_PREFIX = '/request-for-quotation-item';

/**
 * List Request for Quotation Item records.
 */
export async function listRequestForQuotationItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(requestForQuotationItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Request for Quotation Item by ID.
 */
export async function getRequestForQuotationItem(db: any, id: string) {
  const rows = await db.select().from(requestForQuotationItem).where(eq(requestForQuotationItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Request for Quotation Item.
 */
export async function createRequestForQuotationItem(db: any, data: unknown) {
  const parsed = RequestForQuotationItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(requestForQuotationItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Request for Quotation Item.
 */
export async function updateRequestForQuotationItem(db: any, id: string, data: unknown) {
  const parsed = RequestForQuotationItemInsertSchema.partial().parse(data);
  await db.update(requestForQuotationItem).set({ ...parsed, modified: new Date() }).where(eq(requestForQuotationItem.id, id));
  return getRequestForQuotationItem(db, id);
}

/**
 * Delete a Request for Quotation Item by ID.
 */
export async function deleteRequestForQuotationItem(db: any, id: string) {
  await db.delete(requestForQuotationItem).where(eq(requestForQuotationItem.id, id));
  return { deleted: true, id };
}
