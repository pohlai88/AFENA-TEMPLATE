// CRUD API handlers for Customer Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { customerItem } from '../db/schema.js';
import { CustomerItemSchema, CustomerItemInsertSchema } from '../types/customer-item.js';

export const ROUTE_PREFIX = '/customer-item';

/**
 * List Customer Item records.
 */
export async function listCustomerItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(customerItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Customer Item by ID.
 */
export async function getCustomerItem(db: any, id: string) {
  const rows = await db.select().from(customerItem).where(eq(customerItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Customer Item.
 */
export async function createCustomerItem(db: any, data: unknown) {
  const parsed = CustomerItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(customerItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Customer Item.
 */
export async function updateCustomerItem(db: any, id: string, data: unknown) {
  const parsed = CustomerItemInsertSchema.partial().parse(data);
  await db.update(customerItem).set({ ...parsed, modified: new Date() }).where(eq(customerItem.id, id));
  return getCustomerItem(db, id);
}

/**
 * Delete a Customer Item by ID.
 */
export async function deleteCustomerItem(db: any, id: string) {
  await db.delete(customerItem).where(eq(customerItem.id, id));
  return { deleted: true, id };
}
