// CRUD API handlers for Customer Group
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { customerGroup } from '../db/schema.js';
import { CustomerGroupSchema, CustomerGroupInsertSchema } from '../types/customer-group.js';

export const ROUTE_PREFIX = '/customer-group';

/**
 * List Customer Group records.
 */
export async function listCustomerGroup(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(customerGroup).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Customer Group by ID.
 */
export async function getCustomerGroup(db: any, id: string) {
  const rows = await db.select().from(customerGroup).where(eq(customerGroup.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Customer Group.
 */
export async function createCustomerGroup(db: any, data: unknown) {
  const parsed = CustomerGroupInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(customerGroup).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Customer Group.
 */
export async function updateCustomerGroup(db: any, id: string, data: unknown) {
  const parsed = CustomerGroupInsertSchema.partial().parse(data);
  await db.update(customerGroup).set({ ...parsed, modified: new Date() }).where(eq(customerGroup.id, id));
  return getCustomerGroup(db, id);
}

/**
 * Delete a Customer Group by ID.
 */
export async function deleteCustomerGroup(db: any, id: string) {
  await db.delete(customerGroup).where(eq(customerGroup.id, id));
  return { deleted: true, id };
}
