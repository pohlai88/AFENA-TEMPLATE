// CRUD API handlers for Item Customer Detail
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { itemCustomerDetail } from '../db/schema.js';
import { ItemCustomerDetailSchema, ItemCustomerDetailInsertSchema } from '../types/item-customer-detail.js';

export const ROUTE_PREFIX = '/item-customer-detail';

/**
 * List Item Customer Detail records.
 */
export async function listItemCustomerDetail(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(itemCustomerDetail).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Item Customer Detail by ID.
 */
export async function getItemCustomerDetail(db: any, id: string) {
  const rows = await db.select().from(itemCustomerDetail).where(eq(itemCustomerDetail.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Item Customer Detail.
 */
export async function createItemCustomerDetail(db: any, data: unknown) {
  const parsed = ItemCustomerDetailInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(itemCustomerDetail).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Item Customer Detail.
 */
export async function updateItemCustomerDetail(db: any, id: string, data: unknown) {
  const parsed = ItemCustomerDetailInsertSchema.partial().parse(data);
  await db.update(itemCustomerDetail).set({ ...parsed, modified: new Date() }).where(eq(itemCustomerDetail.id, id));
  return getItemCustomerDetail(db, id);
}

/**
 * Delete a Item Customer Detail by ID.
 */
export async function deleteItemCustomerDetail(db: any, id: string) {
  await db.delete(itemCustomerDetail).where(eq(itemCustomerDetail.id, id));
  return { deleted: true, id };
}
