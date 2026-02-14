// CRUD API handlers for Supplier Number At Customer
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { supplierNumberAtCustomer } from '../db/schema.js';
import { SupplierNumberAtCustomerSchema, SupplierNumberAtCustomerInsertSchema } from '../types/supplier-number-at-customer.js';

export const ROUTE_PREFIX = '/supplier-number-at-customer';

/**
 * List Supplier Number At Customer records.
 */
export async function listSupplierNumberAtCustomer(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(supplierNumberAtCustomer).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Supplier Number At Customer by ID.
 */
export async function getSupplierNumberAtCustomer(db: any, id: string) {
  const rows = await db.select().from(supplierNumberAtCustomer).where(eq(supplierNumberAtCustomer.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Supplier Number At Customer.
 */
export async function createSupplierNumberAtCustomer(db: any, data: unknown) {
  const parsed = SupplierNumberAtCustomerInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(supplierNumberAtCustomer).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Supplier Number At Customer.
 */
export async function updateSupplierNumberAtCustomer(db: any, id: string, data: unknown) {
  const parsed = SupplierNumberAtCustomerInsertSchema.partial().parse(data);
  await db.update(supplierNumberAtCustomer).set({ ...parsed, modified: new Date() }).where(eq(supplierNumberAtCustomer.id, id));
  return getSupplierNumberAtCustomer(db, id);
}

/**
 * Delete a Supplier Number At Customer by ID.
 */
export async function deleteSupplierNumberAtCustomer(db: any, id: string) {
  await db.delete(supplierNumberAtCustomer).where(eq(supplierNumberAtCustomer.id, id));
  return { deleted: true, id };
}
