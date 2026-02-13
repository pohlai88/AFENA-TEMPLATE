// CRUD API handlers for Competitor Detail
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { competitorDetail } from '../db/schema.js';
import { CompetitorDetailSchema, CompetitorDetailInsertSchema } from '../types/competitor-detail.js';

export const ROUTE_PREFIX = '/competitor-detail';

/**
 * List Competitor Detail records.
 */
export async function listCompetitorDetail(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(competitorDetail).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Competitor Detail by ID.
 */
export async function getCompetitorDetail(db: any, id: string) {
  const rows = await db.select().from(competitorDetail).where(eq(competitorDetail.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Competitor Detail.
 */
export async function createCompetitorDetail(db: any, data: unknown) {
  const parsed = CompetitorDetailInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(competitorDetail).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Competitor Detail.
 */
export async function updateCompetitorDetail(db: any, id: string, data: unknown) {
  const parsed = CompetitorDetailInsertSchema.partial().parse(data);
  await db.update(competitorDetail).set({ ...parsed, modified: new Date() }).where(eq(competitorDetail.id, id));
  return getCompetitorDetail(db, id);
}

/**
 * Delete a Competitor Detail by ID.
 */
export async function deleteCompetitorDetail(db: any, id: string) {
  await db.delete(competitorDetail).where(eq(competitorDetail.id, id));
  return { deleted: true, id };
}
