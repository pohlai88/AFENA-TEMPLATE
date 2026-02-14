// CRUD API handlers for Website Item Group
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { websiteItemGroup } from '../db/schema.js';
import { WebsiteItemGroupSchema, WebsiteItemGroupInsertSchema } from '../types/website-item-group.js';

export const ROUTE_PREFIX = '/website-item-group';

/**
 * List Website Item Group records.
 */
export async function listWebsiteItemGroup(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(websiteItemGroup).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Website Item Group by ID.
 */
export async function getWebsiteItemGroup(db: any, id: string) {
  const rows = await db.select().from(websiteItemGroup).where(eq(websiteItemGroup.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Website Item Group.
 */
export async function createWebsiteItemGroup(db: any, data: unknown) {
  const parsed = WebsiteItemGroupInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(websiteItemGroup).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Website Item Group.
 */
export async function updateWebsiteItemGroup(db: any, id: string, data: unknown) {
  const parsed = WebsiteItemGroupInsertSchema.partial().parse(data);
  await db.update(websiteItemGroup).set({ ...parsed, modified: new Date() }).where(eq(websiteItemGroup.id, id));
  return getWebsiteItemGroup(db, id);
}

/**
 * Delete a Website Item Group by ID.
 */
export async function deleteWebsiteItemGroup(db: any, id: string) {
  await db.delete(websiteItemGroup).where(eq(websiteItemGroup.id, id));
  return { deleted: true, id };
}
