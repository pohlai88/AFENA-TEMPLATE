// CRUD API handlers for Import Supplier Invoice
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { importSupplierInvoice } from '../db/schema.js';
import { ImportSupplierInvoiceSchema, ImportSupplierInvoiceInsertSchema } from '../types/import-supplier-invoice.js';

export const ROUTE_PREFIX = '/import-supplier-invoice';

/**
 * List Import Supplier Invoice records.
 */
export async function listImportSupplierInvoice(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(importSupplierInvoice).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Import Supplier Invoice by ID.
 */
export async function getImportSupplierInvoice(db: any, id: string) {
  const rows = await db.select().from(importSupplierInvoice).where(eq(importSupplierInvoice.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Import Supplier Invoice.
 */
export async function createImportSupplierInvoice(db: any, data: unknown) {
  const parsed = ImportSupplierInvoiceInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(importSupplierInvoice).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Import Supplier Invoice.
 */
export async function updateImportSupplierInvoice(db: any, id: string, data: unknown) {
  const parsed = ImportSupplierInvoiceInsertSchema.partial().parse(data);
  await db.update(importSupplierInvoice).set({ ...parsed, modified: new Date() }).where(eq(importSupplierInvoice.id, id));
  return getImportSupplierInvoice(db, id);
}

/**
 * Delete a Import Supplier Invoice by ID.
 */
export async function deleteImportSupplierInvoice(db: any, id: string) {
  await db.delete(importSupplierInvoice).where(eq(importSupplierInvoice.id, id));
  return { deleted: true, id };
}
