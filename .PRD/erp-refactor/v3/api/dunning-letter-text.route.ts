// CRUD API handlers for Dunning Letter Text
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { dunningLetterText } from '../db/schema.js';
import { DunningLetterTextSchema, DunningLetterTextInsertSchema } from '../types/dunning-letter-text.js';

export const ROUTE_PREFIX = '/dunning-letter-text';

/**
 * List Dunning Letter Text records.
 */
export async function listDunningLetterText(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(dunningLetterText).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Dunning Letter Text by ID.
 */
export async function getDunningLetterText(db: any, id: string) {
  const rows = await db.select().from(dunningLetterText).where(eq(dunningLetterText.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Dunning Letter Text.
 */
export async function createDunningLetterText(db: any, data: unknown) {
  const parsed = DunningLetterTextInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(dunningLetterText).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Dunning Letter Text.
 */
export async function updateDunningLetterText(db: any, id: string, data: unknown) {
  const parsed = DunningLetterTextInsertSchema.partial().parse(data);
  await db.update(dunningLetterText).set({ ...parsed, modified: new Date() }).where(eq(dunningLetterText.id, id));
  return getDunningLetterText(db, id);
}

/**
 * Delete a Dunning Letter Text by ID.
 */
export async function deleteDunningLetterText(db: any, id: string) {
  await db.delete(dunningLetterText).where(eq(dunningLetterText.id, id));
  return { deleted: true, id };
}
