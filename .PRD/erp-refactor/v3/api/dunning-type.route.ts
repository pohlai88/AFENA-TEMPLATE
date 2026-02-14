// CRUD API handlers for Dunning Type
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { dunningType } from '../db/schema.js';
import { DunningTypeSchema, DunningTypeInsertSchema } from '../types/dunning-type.js';

export const ROUTE_PREFIX = '/dunning-type';

/**
 * List Dunning Type records.
 */
export async function listDunningType(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(dunningType).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Dunning Type by ID.
 */
export async function getDunningType(db: any, id: string) {
  const rows = await db.select().from(dunningType).where(eq(dunningType.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Dunning Type.
 */
export async function createDunningType(db: any, data: unknown) {
  const parsed = DunningTypeInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(dunningType).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Dunning Type.
 */
export async function updateDunningType(db: any, id: string, data: unknown) {
  const parsed = DunningTypeInsertSchema.partial().parse(data);
  await db.update(dunningType).set({ ...parsed, modified: new Date() }).where(eq(dunningType.id, id));
  return getDunningType(db, id);
}

/**
 * Delete a Dunning Type by ID.
 */
export async function deleteDunningType(db: any, id: string) {
  await db.delete(dunningType).where(eq(dunningType.id, id));
  return { deleted: true, id };
}
