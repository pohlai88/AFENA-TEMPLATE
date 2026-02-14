// CRUD API handlers for Website Attribute
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { websiteAttribute } from '../db/schema.js';
import { WebsiteAttributeSchema, WebsiteAttributeInsertSchema } from '../types/website-attribute.js';

export const ROUTE_PREFIX = '/website-attribute';

/**
 * List Website Attribute records.
 */
export async function listWebsiteAttribute(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(websiteAttribute).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Website Attribute by ID.
 */
export async function getWebsiteAttribute(db: any, id: string) {
  const rows = await db.select().from(websiteAttribute).where(eq(websiteAttribute.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Website Attribute.
 */
export async function createWebsiteAttribute(db: any, data: unknown) {
  const parsed = WebsiteAttributeInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(websiteAttribute).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Website Attribute.
 */
export async function updateWebsiteAttribute(db: any, id: string, data: unknown) {
  const parsed = WebsiteAttributeInsertSchema.partial().parse(data);
  await db.update(websiteAttribute).set({ ...parsed, modified: new Date() }).where(eq(websiteAttribute.id, id));
  return getWebsiteAttribute(db, id);
}

/**
 * Delete a Website Attribute by ID.
 */
export async function deleteWebsiteAttribute(db: any, id: string) {
  await db.delete(websiteAttribute).where(eq(websiteAttribute.id, id));
  return { deleted: true, id };
}
