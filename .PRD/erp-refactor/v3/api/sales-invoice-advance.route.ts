// CRUD API handlers for Sales Invoice Advance
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { salesInvoiceAdvance } from '../db/schema.js';
import { SalesInvoiceAdvanceSchema, SalesInvoiceAdvanceInsertSchema } from '../types/sales-invoice-advance.js';

export const ROUTE_PREFIX = '/sales-invoice-advance';

/**
 * List Sales Invoice Advance records.
 */
export async function listSalesInvoiceAdvance(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(salesInvoiceAdvance).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Sales Invoice Advance by ID.
 */
export async function getSalesInvoiceAdvance(db: any, id: string) {
  const rows = await db.select().from(salesInvoiceAdvance).where(eq(salesInvoiceAdvance.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Sales Invoice Advance.
 */
export async function createSalesInvoiceAdvance(db: any, data: unknown) {
  const parsed = SalesInvoiceAdvanceInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(salesInvoiceAdvance).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Sales Invoice Advance.
 */
export async function updateSalesInvoiceAdvance(db: any, id: string, data: unknown) {
  const parsed = SalesInvoiceAdvanceInsertSchema.partial().parse(data);
  await db.update(salesInvoiceAdvance).set({ ...parsed, modified: new Date() }).where(eq(salesInvoiceAdvance.id, id));
  return getSalesInvoiceAdvance(db, id);
}

/**
 * Delete a Sales Invoice Advance by ID.
 */
export async function deleteSalesInvoiceAdvance(db: any, id: string) {
  await db.delete(salesInvoiceAdvance).where(eq(salesInvoiceAdvance.id, id));
  return { deleted: true, id };
}
