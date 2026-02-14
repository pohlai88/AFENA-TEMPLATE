// CRUD API handlers for Item Website Specification
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { itemWebsiteSpecification } from '../db/schema.js';
import { ItemWebsiteSpecificationSchema, ItemWebsiteSpecificationInsertSchema } from '../types/item-website-specification.js';

export const ROUTE_PREFIX = '/item-website-specification';

/**
 * List Item Website Specification records.
 */
export async function listItemWebsiteSpecification(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(itemWebsiteSpecification).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Item Website Specification by ID.
 */
export async function getItemWebsiteSpecification(db: any, id: string) {
  const rows = await db.select().from(itemWebsiteSpecification).where(eq(itemWebsiteSpecification.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Item Website Specification.
 */
export async function createItemWebsiteSpecification(db: any, data: unknown) {
  const parsed = ItemWebsiteSpecificationInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(itemWebsiteSpecification).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Item Website Specification.
 */
export async function updateItemWebsiteSpecification(db: any, id: string, data: unknown) {
  const parsed = ItemWebsiteSpecificationInsertSchema.partial().parse(data);
  await db.update(itemWebsiteSpecification).set({ ...parsed, modified: new Date() }).where(eq(itemWebsiteSpecification.id, id));
  return getItemWebsiteSpecification(db, id);
}

/**
 * Delete a Item Website Specification by ID.
 */
export async function deleteItemWebsiteSpecification(db: any, id: string) {
  await db.delete(itemWebsiteSpecification).where(eq(itemWebsiteSpecification.id, id));
  return { deleted: true, id };
}
