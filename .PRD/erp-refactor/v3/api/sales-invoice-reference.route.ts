// CRUD API handlers for Sales Invoice Reference
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { salesInvoiceReference } from '../db/schema.js';
import { SalesInvoiceReferenceSchema, SalesInvoiceReferenceInsertSchema } from '../types/sales-invoice-reference.js';

export const ROUTE_PREFIX = '/sales-invoice-reference';

/**
 * List Sales Invoice Reference records.
 */
export async function listSalesInvoiceReference(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(salesInvoiceReference).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Sales Invoice Reference by ID.
 */
export async function getSalesInvoiceReference(db: any, id: string) {
  const rows = await db.select().from(salesInvoiceReference).where(eq(salesInvoiceReference.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Sales Invoice Reference.
 */
export async function createSalesInvoiceReference(db: any, data: unknown) {
  const parsed = SalesInvoiceReferenceInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(salesInvoiceReference).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Sales Invoice Reference.
 */
export async function updateSalesInvoiceReference(db: any, id: string, data: unknown) {
  const parsed = SalesInvoiceReferenceInsertSchema.partial().parse(data);
  await db.update(salesInvoiceReference).set({ ...parsed, modified: new Date() }).where(eq(salesInvoiceReference.id, id));
  return getSalesInvoiceReference(db, id);
}

/**
 * Delete a Sales Invoice Reference by ID.
 */
export async function deleteSalesInvoiceReference(db: any, id: string) {
  await db.delete(salesInvoiceReference).where(eq(salesInvoiceReference.id, id));
  return { deleted: true, id };
}
