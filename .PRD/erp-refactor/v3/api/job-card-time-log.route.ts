// CRUD API handlers for Job Card Time Log
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { jobCardTimeLog } from '../db/schema.js';
import { JobCardTimeLogSchema, JobCardTimeLogInsertSchema } from '../types/job-card-time-log.js';

export const ROUTE_PREFIX = '/job-card-time-log';

/**
 * List Job Card Time Log records.
 */
export async function listJobCardTimeLog(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(jobCardTimeLog).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Job Card Time Log by ID.
 */
export async function getJobCardTimeLog(db: any, id: string) {
  const rows = await db.select().from(jobCardTimeLog).where(eq(jobCardTimeLog.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Job Card Time Log.
 */
export async function createJobCardTimeLog(db: any, data: unknown) {
  const parsed = JobCardTimeLogInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(jobCardTimeLog).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Job Card Time Log.
 */
export async function updateJobCardTimeLog(db: any, id: string, data: unknown) {
  const parsed = JobCardTimeLogInsertSchema.partial().parse(data);
  await db.update(jobCardTimeLog).set({ ...parsed, modified: new Date() }).where(eq(jobCardTimeLog.id, id));
  return getJobCardTimeLog(db, id);
}

/**
 * Delete a Job Card Time Log by ID.
 */
export async function deleteJobCardTimeLog(db: any, id: string) {
  await db.delete(jobCardTimeLog).where(eq(jobCardTimeLog.id, id));
  return { deleted: true, id };
}
