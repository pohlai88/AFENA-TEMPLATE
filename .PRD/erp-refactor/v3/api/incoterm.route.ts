// CRUD API handlers for Incoterm
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { incoterm } from '../db/schema.js';
import { IncotermSchema, IncotermInsertSchema } from '../types/incoterm.js';

export const ROUTE_PREFIX = '/incoterm';

/**
 * List Incoterm records.
 */
export async function listIncoterm(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(incoterm).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Incoterm by ID.
 */
export async function getIncoterm(db: any, id: string) {
  const rows = await db.select().from(incoterm).where(eq(incoterm.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Incoterm.
 */
export async function createIncoterm(db: any, data: unknown) {
  const parsed = IncotermInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(incoterm).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Incoterm.
 */
export async function updateIncoterm(db: any, id: string, data: unknown) {
  const parsed = IncotermInsertSchema.partial().parse(data);
  await db.update(incoterm).set({ ...parsed, modified: new Date() }).where(eq(incoterm.id, id));
  return getIncoterm(db, id);
}

/**
 * Delete a Incoterm by ID.
 */
export async function deleteIncoterm(db: any, id: string) {
  await db.delete(incoterm).where(eq(incoterm.id, id));
  return { deleted: true, id };
}
