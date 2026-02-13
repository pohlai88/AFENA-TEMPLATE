// CRUD API handlers for Sales Invoice Timesheet
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { salesInvoiceTimesheet } from '../db/schema.js';
import { SalesInvoiceTimesheetSchema, SalesInvoiceTimesheetInsertSchema } from '../types/sales-invoice-timesheet.js';

export const ROUTE_PREFIX = '/sales-invoice-timesheet';

/**
 * List Sales Invoice Timesheet records.
 */
export async function listSalesInvoiceTimesheet(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(salesInvoiceTimesheet).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Sales Invoice Timesheet by ID.
 */
export async function getSalesInvoiceTimesheet(db: any, id: string) {
  const rows = await db.select().from(salesInvoiceTimesheet).where(eq(salesInvoiceTimesheet.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Sales Invoice Timesheet.
 */
export async function createSalesInvoiceTimesheet(db: any, data: unknown) {
  const parsed = SalesInvoiceTimesheetInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(salesInvoiceTimesheet).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Sales Invoice Timesheet.
 */
export async function updateSalesInvoiceTimesheet(db: any, id: string, data: unknown) {
  const parsed = SalesInvoiceTimesheetInsertSchema.partial().parse(data);
  await db.update(salesInvoiceTimesheet).set({ ...parsed, modified: new Date() }).where(eq(salesInvoiceTimesheet.id, id));
  return getSalesInvoiceTimesheet(db, id);
}

/**
 * Delete a Sales Invoice Timesheet by ID.
 */
export async function deleteSalesInvoiceTimesheet(db: any, id: string) {
  await db.delete(salesInvoiceTimesheet).where(eq(salesInvoiceTimesheet.id, id));
  return { deleted: true, id };
}
