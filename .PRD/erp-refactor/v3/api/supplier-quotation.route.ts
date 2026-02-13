// CRUD API handlers for Supplier Quotation
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { supplierQuotation } from '../db/schema.js';
import { SupplierQuotationSchema, SupplierQuotationInsertSchema } from '../types/supplier-quotation.js';

export const ROUTE_PREFIX = '/supplier-quotation';

/**
 * List Supplier Quotation records.
 */
export async function listSupplierQuotation(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(supplierQuotation).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Supplier Quotation by ID.
 */
export async function getSupplierQuotation(db: any, id: string) {
  const rows = await db.select().from(supplierQuotation).where(eq(supplierQuotation.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Supplier Quotation.
 */
export async function createSupplierQuotation(db: any, data: unknown) {
  const parsed = SupplierQuotationInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(supplierQuotation).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Supplier Quotation.
 */
export async function updateSupplierQuotation(db: any, id: string, data: unknown) {
  const parsed = SupplierQuotationInsertSchema.partial().parse(data);
  await db.update(supplierQuotation).set({ ...parsed, modified: new Date() }).where(eq(supplierQuotation.id, id));
  return getSupplierQuotation(db, id);
}

/**
 * Delete a Supplier Quotation by ID.
 */
export async function deleteSupplierQuotation(db: any, id: string) {
  await db.delete(supplierQuotation).where(eq(supplierQuotation.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Supplier Quotation (set docstatus = 1).
 */
export async function submitSupplierQuotation(db: any, id: string) {
  await db.update(supplierQuotation).set({ docstatus: 1, modified: new Date() }).where(eq(supplierQuotation.id, id));
  return getSupplierQuotation(db, id);
}

/**
 * Cancel a Supplier Quotation (set docstatus = 2).
 */
export async function cancelSupplierQuotation(db: any, id: string) {
  await db.update(supplierQuotation).set({ docstatus: 2, modified: new Date() }).where(eq(supplierQuotation.id, id));
  return getSupplierQuotation(db, id);
}
