// CRUD API handlers for Dunning
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { dunning } from '../db/schema.js';
import { DunningSchema, DunningInsertSchema } from '../types/dunning.js';

export const ROUTE_PREFIX = '/dunning';

/**
 * List Dunning records.
 */
export async function listDunning(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(dunning).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Dunning by ID.
 */
export async function getDunning(db: any, id: string) {
  const rows = await db.select().from(dunning).where(eq(dunning.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Dunning.
 */
export async function createDunning(db: any, data: unknown) {
  const parsed = DunningInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(dunning).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Dunning.
 */
export async function updateDunning(db: any, id: string, data: unknown) {
  const parsed = DunningInsertSchema.partial().parse(data);
  await db.update(dunning).set({ ...parsed, modified: new Date() }).where(eq(dunning.id, id));
  return getDunning(db, id);
}

/**
 * Delete a Dunning by ID.
 */
export async function deleteDunning(db: any, id: string) {
  await db.delete(dunning).where(eq(dunning.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Dunning (set docstatus = 1).
 */
export async function submitDunning(db: any, id: string) {
  await db.update(dunning).set({ docstatus: 1, modified: new Date() }).where(eq(dunning.id, id));
  return getDunning(db, id);
}

/**
 * Cancel a Dunning (set docstatus = 2).
 */
export async function cancelDunning(db: any, id: string) {
  await db.update(dunning).set({ docstatus: 2, modified: new Date() }).where(eq(dunning.id, id));
  return getDunning(db, id);
}
