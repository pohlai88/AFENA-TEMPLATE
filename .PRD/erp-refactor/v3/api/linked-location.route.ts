// CRUD API handlers for Linked Location
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { linkedLocation } from '../db/schema.js';
import { LinkedLocationSchema, LinkedLocationInsertSchema } from '../types/linked-location.js';

export const ROUTE_PREFIX = '/linked-location';

/**
 * List Linked Location records.
 */
export async function listLinkedLocation(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(linkedLocation).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Linked Location by ID.
 */
export async function getLinkedLocation(db: any, id: string) {
  const rows = await db.select().from(linkedLocation).where(eq(linkedLocation.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Linked Location.
 */
export async function createLinkedLocation(db: any, data: unknown) {
  const parsed = LinkedLocationInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(linkedLocation).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Linked Location.
 */
export async function updateLinkedLocation(db: any, id: string, data: unknown) {
  const parsed = LinkedLocationInsertSchema.partial().parse(data);
  await db.update(linkedLocation).set({ ...parsed, modified: new Date() }).where(eq(linkedLocation.id, id));
  return getLinkedLocation(db, id);
}

/**
 * Delete a Linked Location by ID.
 */
export async function deleteLinkedLocation(db: any, id: string) {
  await db.delete(linkedLocation).where(eq(linkedLocation.id, id));
  return { deleted: true, id };
}
