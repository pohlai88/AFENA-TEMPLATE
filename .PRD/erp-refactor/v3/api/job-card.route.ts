// CRUD API handlers for Job Card
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { jobCard } from '../db/schema.js';
import { JobCardSchema, JobCardInsertSchema } from '../types/job-card.js';

export const ROUTE_PREFIX = '/job-card';

/**
 * List Job Card records.
 */
export async function listJobCard(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(jobCard).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Job Card by ID.
 */
export async function getJobCard(db: any, id: string) {
  const rows = await db.select().from(jobCard).where(eq(jobCard.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Job Card.
 */
export async function createJobCard(db: any, data: unknown) {
  const parsed = JobCardInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(jobCard).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Job Card.
 */
export async function updateJobCard(db: any, id: string, data: unknown) {
  const parsed = JobCardInsertSchema.partial().parse(data);
  await db.update(jobCard).set({ ...parsed, modified: new Date() }).where(eq(jobCard.id, id));
  return getJobCard(db, id);
}

/**
 * Delete a Job Card by ID.
 */
export async function deleteJobCard(db: any, id: string) {
  await db.delete(jobCard).where(eq(jobCard.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Job Card (set docstatus = 1).
 */
export async function submitJobCard(db: any, id: string) {
  await db.update(jobCard).set({ docstatus: 1, modified: new Date() }).where(eq(jobCard.id, id));
  return getJobCard(db, id);
}

/**
 * Cancel a Job Card (set docstatus = 2).
 */
export async function cancelJobCard(db: any, id: string) {
  await db.update(jobCard).set({ docstatus: 2, modified: new Date() }).where(eq(jobCard.id, id));
  return getJobCard(db, id);
}
