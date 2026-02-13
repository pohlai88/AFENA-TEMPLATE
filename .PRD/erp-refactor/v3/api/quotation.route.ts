// CRUD API handlers for Quotation
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { quotation } from '../db/schema.js';
import { QuotationSchema, QuotationInsertSchema } from '../types/quotation.js';

export const ROUTE_PREFIX = '/quotation';

/**
 * List Quotation records.
 */
export async function listQuotation(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(quotation).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Quotation by ID.
 */
export async function getQuotation(db: any, id: string) {
  const rows = await db.select().from(quotation).where(eq(quotation.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Quotation.
 */
export async function createQuotation(db: any, data: unknown) {
  const parsed = QuotationInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(quotation).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Quotation.
 */
export async function updateQuotation(db: any, id: string, data: unknown) {
  const parsed = QuotationInsertSchema.partial().parse(data);
  await db.update(quotation).set({ ...parsed, modified: new Date() }).where(eq(quotation.id, id));
  return getQuotation(db, id);
}

/**
 * Delete a Quotation by ID.
 */
export async function deleteQuotation(db: any, id: string) {
  await db.delete(quotation).where(eq(quotation.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Quotation (set docstatus = 1).
 */
export async function submitQuotation(db: any, id: string) {
  await db.update(quotation).set({ docstatus: 1, modified: new Date() }).where(eq(quotation.id, id));
  return getQuotation(db, id);
}

/**
 * Cancel a Quotation (set docstatus = 2).
 */
export async function cancelQuotation(db: any, id: string) {
  await db.update(quotation).set({ docstatus: 2, modified: new Date() }).where(eq(quotation.id, id));
  return getQuotation(db, id);
}
