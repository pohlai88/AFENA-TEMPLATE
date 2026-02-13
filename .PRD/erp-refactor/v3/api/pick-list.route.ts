// CRUD API handlers for Pick List
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { pickList } from '../db/schema.js';
import { PickListSchema, PickListInsertSchema } from '../types/pick-list.js';

export const ROUTE_PREFIX = '/pick-list';

/**
 * List Pick List records.
 */
export async function listPickList(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(pickList).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Pick List by ID.
 */
export async function getPickList(db: any, id: string) {
  const rows = await db.select().from(pickList).where(eq(pickList.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Pick List.
 */
export async function createPickList(db: any, data: unknown) {
  const parsed = PickListInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(pickList).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Pick List.
 */
export async function updatePickList(db: any, id: string, data: unknown) {
  const parsed = PickListInsertSchema.partial().parse(data);
  await db.update(pickList).set({ ...parsed, modified: new Date() }).where(eq(pickList.id, id));
  return getPickList(db, id);
}

/**
 * Delete a Pick List by ID.
 */
export async function deletePickList(db: any, id: string) {
  await db.delete(pickList).where(eq(pickList.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Pick List (set docstatus = 1).
 */
export async function submitPickList(db: any, id: string) {
  await db.update(pickList).set({ docstatus: 1, modified: new Date() }).where(eq(pickList.id, id));
  return getPickList(db, id);
}

/**
 * Cancel a Pick List (set docstatus = 2).
 */
export async function cancelPickList(db: any, id: string) {
  await db.update(pickList).set({ docstatus: 2, modified: new Date() }).where(eq(pickList.id, id));
  return getPickList(db, id);
}
