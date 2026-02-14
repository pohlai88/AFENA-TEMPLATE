// CRUD API handlers for Sales Invoice
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { salesInvoice } from '../db/schema.js';
import { SalesInvoiceSchema, SalesInvoiceInsertSchema } from '../types/sales-invoice.js';

export const ROUTE_PREFIX = '/sales-invoice';

/**
 * List Sales Invoice records.
 */
export async function listSalesInvoice(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(salesInvoice).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Sales Invoice by ID.
 */
export async function getSalesInvoice(db: any, id: string) {
  const rows = await db.select().from(salesInvoice).where(eq(salesInvoice.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Sales Invoice.
 */
export async function createSalesInvoice(db: any, data: unknown) {
  const parsed = SalesInvoiceInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(salesInvoice).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Sales Invoice.
 */
export async function updateSalesInvoice(db: any, id: string, data: unknown) {
  const parsed = SalesInvoiceInsertSchema.partial().parse(data);
  await db.update(salesInvoice).set({ ...parsed, modified: new Date() }).where(eq(salesInvoice.id, id));
  return getSalesInvoice(db, id);
}

/**
 * Delete a Sales Invoice by ID.
 */
export async function deleteSalesInvoice(db: any, id: string) {
  await db.delete(salesInvoice).where(eq(salesInvoice.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Sales Invoice (set docstatus = 1).
 */
export async function submitSalesInvoice(db: any, id: string) {
  await db.update(salesInvoice).set({ docstatus: 1, modified: new Date() }).where(eq(salesInvoice.id, id));
  return getSalesInvoice(db, id);
}

/**
 * Cancel a Sales Invoice (set docstatus = 2).
 */
export async function cancelSalesInvoice(db: any, id: string) {
  await db.update(salesInvoice).set({ docstatus: 2, modified: new Date() }).where(eq(salesInvoice.id, id));
  return getSalesInvoice(db, id);
}
