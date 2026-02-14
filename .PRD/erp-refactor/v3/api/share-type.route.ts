// CRUD API handlers for Share Type
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { shareType } from '../db/schema.js';
import { ShareTypeSchema, ShareTypeInsertSchema } from '../types/share-type.js';

export const ROUTE_PREFIX = '/share-type';

/**
 * List Share Type records.
 */
export async function listShareType(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(shareType).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Share Type by ID.
 */
export async function getShareType(db: any, id: string) {
  const rows = await db.select().from(shareType).where(eq(shareType.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Share Type.
 */
export async function createShareType(db: any, data: unknown) {
  const parsed = ShareTypeInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(shareType).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Share Type.
 */
export async function updateShareType(db: any, id: string, data: unknown) {
  const parsed = ShareTypeInsertSchema.partial().parse(data);
  await db.update(shareType).set({ ...parsed, modified: new Date() }).where(eq(shareType.id, id));
  return getShareType(db, id);
}

/**
 * Delete a Share Type by ID.
 */
export async function deleteShareType(db: any, id: string) {
  await db.delete(shareType).where(eq(shareType.id, id));
  return { deleted: true, id };
}
