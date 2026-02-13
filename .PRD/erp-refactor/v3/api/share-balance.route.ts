// CRUD API handlers for Share Balance
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { shareBalance } from '../db/schema.js';
import { ShareBalanceSchema, ShareBalanceInsertSchema } from '../types/share-balance.js';

export const ROUTE_PREFIX = '/share-balance';

/**
 * List Share Balance records.
 */
export async function listShareBalance(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(shareBalance).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Share Balance by ID.
 */
export async function getShareBalance(db: any, id: string) {
  const rows = await db.select().from(shareBalance).where(eq(shareBalance.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Share Balance.
 */
export async function createShareBalance(db: any, data: unknown) {
  const parsed = ShareBalanceInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(shareBalance).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Share Balance.
 */
export async function updateShareBalance(db: any, id: string, data: unknown) {
  const parsed = ShareBalanceInsertSchema.partial().parse(data);
  await db.update(shareBalance).set({ ...parsed, modified: new Date() }).where(eq(shareBalance.id, id));
  return getShareBalance(db, id);
}

/**
 * Delete a Share Balance by ID.
 */
export async function deleteShareBalance(db: any, id: string) {
  await db.delete(shareBalance).where(eq(shareBalance.id, id));
  return { deleted: true, id };
}
