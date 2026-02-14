// CRUD API handlers for Customer Credit Limit
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { customerCreditLimit } from '../db/schema.js';
import { CustomerCreditLimitSchema, CustomerCreditLimitInsertSchema } from '../types/customer-credit-limit.js';

export const ROUTE_PREFIX = '/customer-credit-limit';

/**
 * List Customer Credit Limit records.
 */
export async function listCustomerCreditLimit(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(customerCreditLimit).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Customer Credit Limit by ID.
 */
export async function getCustomerCreditLimit(db: any, id: string) {
  const rows = await db.select().from(customerCreditLimit).where(eq(customerCreditLimit.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Customer Credit Limit.
 */
export async function createCustomerCreditLimit(db: any, data: unknown) {
  const parsed = CustomerCreditLimitInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(customerCreditLimit).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Customer Credit Limit.
 */
export async function updateCustomerCreditLimit(db: any, id: string, data: unknown) {
  const parsed = CustomerCreditLimitInsertSchema.partial().parse(data);
  await db.update(customerCreditLimit).set({ ...parsed, modified: new Date() }).where(eq(customerCreditLimit.id, id));
  return getCustomerCreditLimit(db, id);
}

/**
 * Delete a Customer Credit Limit by ID.
 */
export async function deleteCustomerCreditLimit(db: any, id: string) {
  await db.delete(customerCreditLimit).where(eq(customerCreditLimit.id, id));
  return { deleted: true, id };
}
