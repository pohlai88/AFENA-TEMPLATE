// CRUD API handlers for Support Search Source
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { supportSearchSource } from '../db/schema.js';
import { SupportSearchSourceSchema, SupportSearchSourceInsertSchema } from '../types/support-search-source.js';

export const ROUTE_PREFIX = '/support-search-source';

/**
 * List Support Search Source records.
 */
export async function listSupportSearchSource(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(supportSearchSource).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Support Search Source by ID.
 */
export async function getSupportSearchSource(db: any, id: string) {
  const rows = await db.select().from(supportSearchSource).where(eq(supportSearchSource.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Support Search Source.
 */
export async function createSupportSearchSource(db: any, data: unknown) {
  const parsed = SupportSearchSourceInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(supportSearchSource).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Support Search Source.
 */
export async function updateSupportSearchSource(db: any, id: string, data: unknown) {
  const parsed = SupportSearchSourceInsertSchema.partial().parse(data);
  await db.update(supportSearchSource).set({ ...parsed, modified: new Date() }).where(eq(supportSearchSource.id, id));
  return getSupportSearchSource(db, id);
}

/**
 * Delete a Support Search Source by ID.
 */
export async function deleteSupportSearchSource(db: any, id: string) {
  await db.delete(supportSearchSource).where(eq(supportSearchSource.id, id));
  return { deleted: true, id };
}
