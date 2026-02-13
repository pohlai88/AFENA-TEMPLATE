// CRUD API handlers for Downtime Entry
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { downtimeEntry } from '../db/schema.js';
import { DowntimeEntrySchema, DowntimeEntryInsertSchema } from '../types/downtime-entry.js';

export const ROUTE_PREFIX = '/downtime-entry';

/**
 * List Downtime Entry records.
 */
export async function listDowntimeEntry(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(downtimeEntry).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Downtime Entry by ID.
 */
export async function getDowntimeEntry(db: any, id: string) {
  const rows = await db.select().from(downtimeEntry).where(eq(downtimeEntry.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Downtime Entry.
 */
export async function createDowntimeEntry(db: any, data: unknown) {
  const parsed = DowntimeEntryInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(downtimeEntry).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Downtime Entry.
 */
export async function updateDowntimeEntry(db: any, id: string, data: unknown) {
  const parsed = DowntimeEntryInsertSchema.partial().parse(data);
  await db.update(downtimeEntry).set({ ...parsed, modified: new Date() }).where(eq(downtimeEntry.id, id));
  return getDowntimeEntry(db, id);
}

/**
 * Delete a Downtime Entry by ID.
 */
export async function deleteDowntimeEntry(db: any, id: string) {
  await db.delete(downtimeEntry).where(eq(downtimeEntry.id, id));
  return { deleted: true, id };
}
