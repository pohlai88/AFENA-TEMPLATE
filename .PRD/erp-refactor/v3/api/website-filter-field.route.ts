// CRUD API handlers for Website Filter Field
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { websiteFilterField } from '../db/schema.js';
import { WebsiteFilterFieldSchema, WebsiteFilterFieldInsertSchema } from '../types/website-filter-field.js';

export const ROUTE_PREFIX = '/website-filter-field';

/**
 * List Website Filter Field records.
 */
export async function listWebsiteFilterField(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(websiteFilterField).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Website Filter Field by ID.
 */
export async function getWebsiteFilterField(db: any, id: string) {
  const rows = await db.select().from(websiteFilterField).where(eq(websiteFilterField.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Website Filter Field.
 */
export async function createWebsiteFilterField(db: any, data: unknown) {
  const parsed = WebsiteFilterFieldInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(websiteFilterField).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Website Filter Field.
 */
export async function updateWebsiteFilterField(db: any, id: string, data: unknown) {
  const parsed = WebsiteFilterFieldInsertSchema.partial().parse(data);
  await db.update(websiteFilterField).set({ ...parsed, modified: new Date() }).where(eq(websiteFilterField.id, id));
  return getWebsiteFilterField(db, id);
}

/**
 * Delete a Website Filter Field by ID.
 */
export async function deleteWebsiteFilterField(db: any, id: string) {
  await db.delete(websiteFilterField).where(eq(websiteFilterField.id, id));
  return { deleted: true, id };
}
