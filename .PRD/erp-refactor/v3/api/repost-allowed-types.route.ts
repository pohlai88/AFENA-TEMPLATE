// CRUD API handlers for Repost Allowed Types
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { repostAllowedTypes } from '../db/schema.js';
import { RepostAllowedTypesSchema, RepostAllowedTypesInsertSchema } from '../types/repost-allowed-types.js';

export const ROUTE_PREFIX = '/repost-allowed-types';

/**
 * List Repost Allowed Types records.
 */
export async function listRepostAllowedTypes(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(repostAllowedTypes).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Repost Allowed Types by ID.
 */
export async function getRepostAllowedTypes(db: any, id: string) {
  const rows = await db.select().from(repostAllowedTypes).where(eq(repostAllowedTypes.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Repost Allowed Types.
 */
export async function createRepostAllowedTypes(db: any, data: unknown) {
  const parsed = RepostAllowedTypesInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(repostAllowedTypes).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Repost Allowed Types.
 */
export async function updateRepostAllowedTypes(db: any, id: string, data: unknown) {
  const parsed = RepostAllowedTypesInsertSchema.partial().parse(data);
  await db.update(repostAllowedTypes).set({ ...parsed, modified: new Date() }).where(eq(repostAllowedTypes.id, id));
  return getRepostAllowedTypes(db, id);
}

/**
 * Delete a Repost Allowed Types by ID.
 */
export async function deleteRepostAllowedTypes(db: any, id: string) {
  await db.delete(repostAllowedTypes).where(eq(repostAllowedTypes.id, id));
  return { deleted: true, id };
}
