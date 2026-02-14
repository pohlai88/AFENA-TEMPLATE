// CRUD API handlers for GL Entry
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { glEntry } from '../db/schema.js';
import { GlEntrySchema, GlEntryInsertSchema } from '../types/gl-entry.js';

export const ROUTE_PREFIX = '/gl-entry';

/**
 * List GL Entry records.
 */
export async function listGlEntry(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(glEntry).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single GL Entry by ID.
 */
export async function getGlEntry(db: any, id: string) {
  const rows = await db.select().from(glEntry).where(eq(glEntry.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new GL Entry.
 */
export async function createGlEntry(db: any, data: unknown) {
  const parsed = GlEntryInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(glEntry).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing GL Entry.
 */
export async function updateGlEntry(db: any, id: string, data: unknown) {
  const parsed = GlEntryInsertSchema.partial().parse(data);
  await db.update(glEntry).set({ ...parsed, modified: new Date() }).where(eq(glEntry.id, id));
  return getGlEntry(db, id);
}

/**
 * Delete a GL Entry by ID.
 */
export async function deleteGlEntry(db: any, id: string) {
  await db.delete(glEntry).where(eq(glEntry.id, id));
  return { deleted: true, id };
}
