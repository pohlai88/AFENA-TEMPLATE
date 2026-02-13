// CRUD API handlers for Item Tax Template Detail
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { itemTaxTemplateDetail } from '../db/schema.js';
import { ItemTaxTemplateDetailSchema, ItemTaxTemplateDetailInsertSchema } from '../types/item-tax-template-detail.js';

export const ROUTE_PREFIX = '/item-tax-template-detail';

/**
 * List Item Tax Template Detail records.
 */
export async function listItemTaxTemplateDetail(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(itemTaxTemplateDetail).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Item Tax Template Detail by ID.
 */
export async function getItemTaxTemplateDetail(db: any, id: string) {
  const rows = await db.select().from(itemTaxTemplateDetail).where(eq(itemTaxTemplateDetail.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Item Tax Template Detail.
 */
export async function createItemTaxTemplateDetail(db: any, data: unknown) {
  const parsed = ItemTaxTemplateDetailInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(itemTaxTemplateDetail).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Item Tax Template Detail.
 */
export async function updateItemTaxTemplateDetail(db: any, id: string, data: unknown) {
  const parsed = ItemTaxTemplateDetailInsertSchema.partial().parse(data);
  await db.update(itemTaxTemplateDetail).set({ ...parsed, modified: new Date() }).where(eq(itemTaxTemplateDetail.id, id));
  return getItemTaxTemplateDetail(db, id);
}

/**
 * Delete a Item Tax Template Detail by ID.
 */
export async function deleteItemTaxTemplateDetail(db: any, id: string) {
  await db.delete(itemTaxTemplateDetail).where(eq(itemTaxTemplateDetail.id, id));
  return { deleted: true, id };
}
