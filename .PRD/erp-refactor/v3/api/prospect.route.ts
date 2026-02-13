// CRUD API handlers for Prospect
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { prospect } from '../db/schema.js';
import { ProspectSchema, ProspectInsertSchema } from '../types/prospect.js';

export const ROUTE_PREFIX = '/prospect';

/**
 * List Prospect records.
 */
export async function listProspect(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(prospect).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Prospect by ID.
 */
export async function getProspect(db: any, id: string) {
  const rows = await db.select().from(prospect).where(eq(prospect.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Prospect.
 */
export async function createProspect(db: any, data: unknown) {
  const parsed = ProspectInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(prospect).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Prospect.
 */
export async function updateProspect(db: any, id: string, data: unknown) {
  const parsed = ProspectInsertSchema.partial().parse(data);
  await db.update(prospect).set({ ...parsed, modified: new Date() }).where(eq(prospect.id, id));
  return getProspect(db, id);
}

/**
 * Delete a Prospect by ID.
 */
export async function deleteProspect(db: any, id: string) {
  await db.delete(prospect).where(eq(prospect.id, id));
  return { deleted: true, id };
}
