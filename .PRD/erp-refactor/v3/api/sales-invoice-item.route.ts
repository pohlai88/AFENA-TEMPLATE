// CRUD API handlers for Sales Invoice Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { salesInvoiceItem } from '../db/schema.js';
import { SalesInvoiceItemSchema, SalesInvoiceItemInsertSchema } from '../types/sales-invoice-item.js';

export const ROUTE_PREFIX = '/sales-invoice-item';

/**
 * List Sales Invoice Item records.
 */
export async function listSalesInvoiceItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(salesInvoiceItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Sales Invoice Item by ID.
 */
export async function getSalesInvoiceItem(db: any, id: string) {
  const rows = await db.select().from(salesInvoiceItem).where(eq(salesInvoiceItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Sales Invoice Item.
 */
export async function createSalesInvoiceItem(db: any, data: unknown) {
  const parsed = SalesInvoiceItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(salesInvoiceItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Sales Invoice Item.
 */
export async function updateSalesInvoiceItem(db: any, id: string, data: unknown) {
  const parsed = SalesInvoiceItemInsertSchema.partial().parse(data);
  await db.update(salesInvoiceItem).set({ ...parsed, modified: new Date() }).where(eq(salesInvoiceItem.id, id));
  return getSalesInvoiceItem(db, id);
}

/**
 * Delete a Sales Invoice Item by ID.
 */
export async function deleteSalesInvoiceItem(db: any, id: string) {
  await db.delete(salesInvoiceItem).where(eq(salesInvoiceItem.id, id));
  return { deleted: true, id };
}
