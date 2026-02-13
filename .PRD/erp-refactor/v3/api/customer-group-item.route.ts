// CRUD API handlers for Customer Group Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { customerGroupItem } from '../db/schema.js';
import { CustomerGroupItemSchema, CustomerGroupItemInsertSchema } from '../types/customer-group-item.js';

export const ROUTE_PREFIX = '/customer-group-item';

/**
 * List Customer Group Item records.
 */
export async function listCustomerGroupItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(customerGroupItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Customer Group Item by ID.
 */
export async function getCustomerGroupItem(db: any, id: string) {
  const rows = await db.select().from(customerGroupItem).where(eq(customerGroupItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Customer Group Item.
 */
export async function createCustomerGroupItem(db: any, data: unknown) {
  const parsed = CustomerGroupItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(customerGroupItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Customer Group Item.
 */
export async function updateCustomerGroupItem(db: any, id: string, data: unknown) {
  const parsed = CustomerGroupItemInsertSchema.partial().parse(data);
  await db.update(customerGroupItem).set({ ...parsed, modified: new Date() }).where(eq(customerGroupItem.id, id));
  return getCustomerGroupItem(db, id);
}

/**
 * Delete a Customer Group Item by ID.
 */
export async function deleteCustomerGroupItem(db: any, id: string) {
  await db.delete(customerGroupItem).where(eq(customerGroupItem.id, id));
  return { deleted: true, id };
}
