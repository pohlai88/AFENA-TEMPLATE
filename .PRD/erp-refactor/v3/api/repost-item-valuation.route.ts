// CRUD API handlers for Repost Item Valuation
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { repostItemValuation } from '../db/schema.js';
import { RepostItemValuationSchema, RepostItemValuationInsertSchema } from '../types/repost-item-valuation.js';

export const ROUTE_PREFIX = '/repost-item-valuation';

/**
 * List Repost Item Valuation records.
 */
export async function listRepostItemValuation(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(repostItemValuation).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Repost Item Valuation by ID.
 */
export async function getRepostItemValuation(db: any, id: string) {
  const rows = await db.select().from(repostItemValuation).where(eq(repostItemValuation.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Repost Item Valuation.
 */
export async function createRepostItemValuation(db: any, data: unknown) {
  const parsed = RepostItemValuationInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(repostItemValuation).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Repost Item Valuation.
 */
export async function updateRepostItemValuation(db: any, id: string, data: unknown) {
  const parsed = RepostItemValuationInsertSchema.partial().parse(data);
  await db.update(repostItemValuation).set({ ...parsed, modified: new Date() }).where(eq(repostItemValuation.id, id));
  return getRepostItemValuation(db, id);
}

/**
 * Delete a Repost Item Valuation by ID.
 */
export async function deleteRepostItemValuation(db: any, id: string) {
  await db.delete(repostItemValuation).where(eq(repostItemValuation.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Repost Item Valuation (set docstatus = 1).
 */
export async function submitRepostItemValuation(db: any, id: string) {
  await db.update(repostItemValuation).set({ docstatus: 1, modified: new Date() }).where(eq(repostItemValuation.id, id));
  return getRepostItemValuation(db, id);
}

/**
 * Cancel a Repost Item Valuation (set docstatus = 2).
 */
export async function cancelRepostItemValuation(db: any, id: string) {
  await db.update(repostItemValuation).set({ docstatus: 2, modified: new Date() }).where(eq(repostItemValuation.id, id));
  return getRepostItemValuation(db, id);
}
