// CRUD API handlers for Competitor
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { competitor } from '../db/schema.js';
import { CompetitorSchema, CompetitorInsertSchema } from '../types/competitor.js';

export const ROUTE_PREFIX = '/competitor';

/**
 * List Competitor records.
 */
export async function listCompetitor(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(competitor).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Competitor by ID.
 */
export async function getCompetitor(db: any, id: string) {
  const rows = await db.select().from(competitor).where(eq(competitor.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Competitor.
 */
export async function createCompetitor(db: any, data: unknown) {
  const parsed = CompetitorInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(competitor).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Competitor.
 */
export async function updateCompetitor(db: any, id: string, data: unknown) {
  const parsed = CompetitorInsertSchema.partial().parse(data);
  await db.update(competitor).set({ ...parsed, modified: new Date() }).where(eq(competitor.id, id));
  return getCompetitor(db, id);
}

/**
 * Delete a Competitor by ID.
 */
export async function deleteCompetitor(db: any, id: string) {
  await db.delete(competitor).where(eq(competitor.id, id));
  return { deleted: true, id };
}
