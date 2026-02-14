// CRUD API handlers for Supplier Quotation Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { supplierQuotationItem } from '../db/schema.js';
import { SupplierQuotationItemSchema, SupplierQuotationItemInsertSchema } from '../types/supplier-quotation-item.js';

export const ROUTE_PREFIX = '/supplier-quotation-item';

/**
 * List Supplier Quotation Item records.
 */
export async function listSupplierQuotationItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(supplierQuotationItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Supplier Quotation Item by ID.
 */
export async function getSupplierQuotationItem(db: any, id: string) {
  const rows = await db.select().from(supplierQuotationItem).where(eq(supplierQuotationItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Supplier Quotation Item.
 */
export async function createSupplierQuotationItem(db: any, data: unknown) {
  const parsed = SupplierQuotationItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(supplierQuotationItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Supplier Quotation Item.
 */
export async function updateSupplierQuotationItem(db: any, id: string, data: unknown) {
  const parsed = SupplierQuotationItemInsertSchema.partial().parse(data);
  await db.update(supplierQuotationItem).set({ ...parsed, modified: new Date() }).where(eq(supplierQuotationItem.id, id));
  return getSupplierQuotationItem(db, id);
}

/**
 * Delete a Supplier Quotation Item by ID.
 */
export async function deleteSupplierQuotationItem(db: any, id: string) {
  await db.delete(supplierQuotationItem).where(eq(supplierQuotationItem.id, id));
  return { deleted: true, id };
}
