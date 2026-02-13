// CRUD API handlers for Sales Partner Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { salesPartnerItem } from '../db/schema.js';
import { SalesPartnerItemSchema, SalesPartnerItemInsertSchema } from '../types/sales-partner-item.js';

export const ROUTE_PREFIX = '/sales-partner-item';

/**
 * List Sales Partner Item records.
 */
export async function listSalesPartnerItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(salesPartnerItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Sales Partner Item by ID.
 */
export async function getSalesPartnerItem(db: any, id: string) {
  const rows = await db.select().from(salesPartnerItem).where(eq(salesPartnerItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Sales Partner Item.
 */
export async function createSalesPartnerItem(db: any, data: unknown) {
  const parsed = SalesPartnerItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(salesPartnerItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Sales Partner Item.
 */
export async function updateSalesPartnerItem(db: any, id: string, data: unknown) {
  const parsed = SalesPartnerItemInsertSchema.partial().parse(data);
  await db.update(salesPartnerItem).set({ ...parsed, modified: new Date() }).where(eq(salesPartnerItem.id, id));
  return getSalesPartnerItem(db, id);
}

/**
 * Delete a Sales Partner Item by ID.
 */
export async function deleteSalesPartnerItem(db: any, id: string) {
  await db.delete(salesPartnerItem).where(eq(salesPartnerItem.id, id));
  return { deleted: true, id };
}
