// CRUD API handlers for Customer
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { customer } from '../db/schema.js';
import { CustomerSchema, CustomerInsertSchema } from '../types/customer.js';

export const ROUTE_PREFIX = '/customer';

/**
 * List Customer records.
 */
export async function listCustomer(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(customer).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Customer by ID.
 */
export async function getCustomer(db: any, id: string) {
  const rows = await db.select().from(customer).where(eq(customer.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Customer.
 */
export async function createCustomer(db: any, data: unknown) {
  const parsed = CustomerInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(customer).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Customer.
 */
export async function updateCustomer(db: any, id: string, data: unknown) {
  const parsed = CustomerInsertSchema.partial().parse(data);
  await db.update(customer).set({ ...parsed, modified: new Date() }).where(eq(customer.id, id));
  return getCustomer(db, id);
}

/**
 * Delete a Customer by ID.
 */
export async function deleteCustomer(db: any, id: string) {
  await db.delete(customer).where(eq(customer.id, id));
  return { deleted: true, id };
}
