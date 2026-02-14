// CRUD API handlers for Job Card Scheduled Time
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { jobCardScheduledTime } from '../db/schema.js';
import { JobCardScheduledTimeSchema, JobCardScheduledTimeInsertSchema } from '../types/job-card-scheduled-time.js';

export const ROUTE_PREFIX = '/job-card-scheduled-time';

/**
 * List Job Card Scheduled Time records.
 */
export async function listJobCardScheduledTime(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(jobCardScheduledTime).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Job Card Scheduled Time by ID.
 */
export async function getJobCardScheduledTime(db: any, id: string) {
  const rows = await db.select().from(jobCardScheduledTime).where(eq(jobCardScheduledTime.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Job Card Scheduled Time.
 */
export async function createJobCardScheduledTime(db: any, data: unknown) {
  const parsed = JobCardScheduledTimeInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(jobCardScheduledTime).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Job Card Scheduled Time.
 */
export async function updateJobCardScheduledTime(db: any, id: string, data: unknown) {
  const parsed = JobCardScheduledTimeInsertSchema.partial().parse(data);
  await db.update(jobCardScheduledTime).set({ ...parsed, modified: new Date() }).where(eq(jobCardScheduledTime.id, id));
  return getJobCardScheduledTime(db, id);
}

/**
 * Delete a Job Card Scheduled Time by ID.
 */
export async function deleteJobCardScheduledTime(db: any, id: string) {
  await db.delete(jobCardScheduledTime).where(eq(jobCardScheduledTime.id, id));
  return { deleted: true, id };
}
