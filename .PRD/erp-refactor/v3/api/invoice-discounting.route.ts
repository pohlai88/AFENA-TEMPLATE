// CRUD API handlers for Invoice Discounting
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { invoiceDiscounting } from '../db/schema.js';
import { InvoiceDiscountingSchema, InvoiceDiscountingInsertSchema } from '../types/invoice-discounting.js';

export const ROUTE_PREFIX = '/invoice-discounting';

/**
 * List Invoice Discounting records.
 */
export async function listInvoiceDiscounting(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(invoiceDiscounting).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Invoice Discounting by ID.
 */
export async function getInvoiceDiscounting(db: any, id: string) {
  const rows = await db.select().from(invoiceDiscounting).where(eq(invoiceDiscounting.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Invoice Discounting.
 */
export async function createInvoiceDiscounting(db: any, data: unknown) {
  const parsed = InvoiceDiscountingInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(invoiceDiscounting).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Invoice Discounting.
 */
export async function updateInvoiceDiscounting(db: any, id: string, data: unknown) {
  const parsed = InvoiceDiscountingInsertSchema.partial().parse(data);
  await db.update(invoiceDiscounting).set({ ...parsed, modified: new Date() }).where(eq(invoiceDiscounting.id, id));
  return getInvoiceDiscounting(db, id);
}

/**
 * Delete a Invoice Discounting by ID.
 */
export async function deleteInvoiceDiscounting(db: any, id: string) {
  await db.delete(invoiceDiscounting).where(eq(invoiceDiscounting.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Invoice Discounting (set docstatus = 1).
 */
export async function submitInvoiceDiscounting(db: any, id: string) {
  await db.update(invoiceDiscounting).set({ docstatus: 1, modified: new Date() }).where(eq(invoiceDiscounting.id, id));
  return getInvoiceDiscounting(db, id);
}

/**
 * Cancel a Invoice Discounting (set docstatus = 2).
 */
export async function cancelInvoiceDiscounting(db: any, id: string) {
  await db.update(invoiceDiscounting).set({ docstatus: 2, modified: new Date() }).where(eq(invoiceDiscounting.id, id));
  return getInvoiceDiscounting(db, id);
}
