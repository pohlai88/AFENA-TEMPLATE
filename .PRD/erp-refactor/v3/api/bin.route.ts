// CRUD API handlers for Bin
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { bin } from '../db/schema.js';
import { BinSchema, BinInsertSchema } from '../types/bin.js';

export const ROUTE_PREFIX = '/bin';

/**
 * List Bin records.
 */
export async function listBin(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(bin).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Bin by ID.
 */
export async function getBin(db: any, id: string) {
  const rows = await db.select().from(bin).where(eq(bin.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Bin.
 */
export async function createBin(db: any, data: unknown) {
  const parsed = BinInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(bin).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Bin.
 */
export async function updateBin(db: any, id: string, data: unknown) {
  const parsed = BinInsertSchema.partial().parse(data);
  await db.update(bin).set({ ...parsed, modified: new Date() }).where(eq(bin.id, id));
  return getBin(db, id);
}

/**
 * Delete a Bin by ID.
 */
export async function deleteBin(db: any, id: string) {
  await db.delete(bin).where(eq(bin.id, id));
  return { deleted: true, id };
}
