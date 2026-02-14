// CRUD API handlers for Customer Number At Supplier
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { customerNumberAtSupplier } from '../db/schema.js';
import { CustomerNumberAtSupplierSchema, CustomerNumberAtSupplierInsertSchema } from '../types/customer-number-at-supplier.js';

export const ROUTE_PREFIX = '/customer-number-at-supplier';

/**
 * List Customer Number At Supplier records.
 */
export async function listCustomerNumberAtSupplier(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(customerNumberAtSupplier).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Customer Number At Supplier by ID.
 */
export async function getCustomerNumberAtSupplier(db: any, id: string) {
  const rows = await db.select().from(customerNumberAtSupplier).where(eq(customerNumberAtSupplier.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Customer Number At Supplier.
 */
export async function createCustomerNumberAtSupplier(db: any, data: unknown) {
  const parsed = CustomerNumberAtSupplierInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(customerNumberAtSupplier).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Customer Number At Supplier.
 */
export async function updateCustomerNumberAtSupplier(db: any, id: string, data: unknown) {
  const parsed = CustomerNumberAtSupplierInsertSchema.partial().parse(data);
  await db.update(customerNumberAtSupplier).set({ ...parsed, modified: new Date() }).where(eq(customerNumberAtSupplier.id, id));
  return getCustomerNumberAtSupplier(db, id);
}

/**
 * Delete a Customer Number At Supplier by ID.
 */
export async function deleteCustomerNumberAtSupplier(db: any, id: string) {
  await db.delete(customerNumberAtSupplier).where(eq(customerNumberAtSupplier.id, id));
  return { deleted: true, id };
}
