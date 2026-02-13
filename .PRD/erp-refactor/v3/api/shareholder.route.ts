// CRUD API handlers for Shareholder
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { shareholder } from '../db/schema.js';
import { ShareholderSchema, ShareholderInsertSchema } from '../types/shareholder.js';

export const ROUTE_PREFIX = '/shareholder';

/**
 * List Shareholder records.
 */
export async function listShareholder(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(shareholder).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Shareholder by ID.
 */
export async function getShareholder(db: any, id: string) {
  const rows = await db.select().from(shareholder).where(eq(shareholder.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Shareholder.
 */
export async function createShareholder(db: any, data: unknown) {
  const parsed = ShareholderInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(shareholder).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Shareholder.
 */
export async function updateShareholder(db: any, id: string, data: unknown) {
  const parsed = ShareholderInsertSchema.partial().parse(data);
  await db.update(shareholder).set({ ...parsed, modified: new Date() }).where(eq(shareholder.id, id));
  return getShareholder(db, id);
}

/**
 * Delete a Shareholder by ID.
 */
export async function deleteShareholder(db: any, id: string) {
  await db.delete(shareholder).where(eq(shareholder.id, id));
  return { deleted: true, id };
}
