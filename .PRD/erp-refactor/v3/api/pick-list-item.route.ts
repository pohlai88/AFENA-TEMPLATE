// CRUD API handlers for Pick List Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { pickListItem } from '../db/schema.js';
import { PickListItemSchema, PickListItemInsertSchema } from '../types/pick-list-item.js';

export const ROUTE_PREFIX = '/pick-list-item';

/**
 * List Pick List Item records.
 */
export async function listPickListItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(pickListItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Pick List Item by ID.
 */
export async function getPickListItem(db: any, id: string) {
  const rows = await db.select().from(pickListItem).where(eq(pickListItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Pick List Item.
 */
export async function createPickListItem(db: any, data: unknown) {
  const parsed = PickListItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(pickListItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Pick List Item.
 */
export async function updatePickListItem(db: any, id: string, data: unknown) {
  const parsed = PickListItemInsertSchema.partial().parse(data);
  await db.update(pickListItem).set({ ...parsed, modified: new Date() }).where(eq(pickListItem.id, id));
  return getPickListItem(db, id);
}

/**
 * Delete a Pick List Item by ID.
 */
export async function deletePickListItem(db: any, id: string) {
  await db.delete(pickListItem).where(eq(pickListItem.id, id));
  return { deleted: true, id };
}
