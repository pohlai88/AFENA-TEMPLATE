// CRUD API handlers for Non Conformance
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { nonConformance } from '../db/schema.js';
import { NonConformanceSchema, NonConformanceInsertSchema } from '../types/non-conformance.js';

export const ROUTE_PREFIX = '/non-conformance';

/**
 * List Non Conformance records.
 */
export async function listNonConformance(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(nonConformance).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Non Conformance by ID.
 */
export async function getNonConformance(db: any, id: string) {
  const rows = await db.select().from(nonConformance).where(eq(nonConformance.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Non Conformance.
 */
export async function createNonConformance(db: any, data: unknown) {
  const parsed = NonConformanceInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(nonConformance).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Non Conformance.
 */
export async function updateNonConformance(db: any, id: string, data: unknown) {
  const parsed = NonConformanceInsertSchema.partial().parse(data);
  await db.update(nonConformance).set({ ...parsed, modified: new Date() }).where(eq(nonConformance.id, id));
  return getNonConformance(db, id);
}

/**
 * Delete a Non Conformance by ID.
 */
export async function deleteNonConformance(db: any, id: string) {
  await db.delete(nonConformance).where(eq(nonConformance.id, id));
  return { deleted: true, id };
}
