// CRUD API handlers for Item Tax Template
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { itemTaxTemplate } from '../db/schema.js';
import { ItemTaxTemplateSchema, ItemTaxTemplateInsertSchema } from '../types/item-tax-template.js';

export const ROUTE_PREFIX = '/item-tax-template';

/**
 * List Item Tax Template records.
 */
export async function listItemTaxTemplate(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(itemTaxTemplate).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Item Tax Template by ID.
 */
export async function getItemTaxTemplate(db: any, id: string) {
  const rows = await db.select().from(itemTaxTemplate).where(eq(itemTaxTemplate.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Item Tax Template.
 */
export async function createItemTaxTemplate(db: any, data: unknown) {
  const parsed = ItemTaxTemplateInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(itemTaxTemplate).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Item Tax Template.
 */
export async function updateItemTaxTemplate(db: any, id: string, data: unknown) {
  const parsed = ItemTaxTemplateInsertSchema.partial().parse(data);
  await db.update(itemTaxTemplate).set({ ...parsed, modified: new Date() }).where(eq(itemTaxTemplate.id, id));
  return getItemTaxTemplate(db, id);
}

/**
 * Delete a Item Tax Template by ID.
 */
export async function deleteItemTaxTemplate(db: any, id: string) {
  await db.delete(itemTaxTemplate).where(eq(itemTaxTemplate.id, id));
  return { deleted: true, id };
}
