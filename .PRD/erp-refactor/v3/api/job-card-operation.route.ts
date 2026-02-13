// CRUD API handlers for Job Card Operation
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { jobCardOperation } from '../db/schema.js';
import { JobCardOperationSchema, JobCardOperationInsertSchema } from '../types/job-card-operation.js';

export const ROUTE_PREFIX = '/job-card-operation';

/**
 * List Job Card Operation records.
 */
export async function listJobCardOperation(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(jobCardOperation).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Job Card Operation by ID.
 */
export async function getJobCardOperation(db: any, id: string) {
  const rows = await db.select().from(jobCardOperation).where(eq(jobCardOperation.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Job Card Operation.
 */
export async function createJobCardOperation(db: any, data: unknown) {
  const parsed = JobCardOperationInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(jobCardOperation).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Job Card Operation.
 */
export async function updateJobCardOperation(db: any, id: string, data: unknown) {
  const parsed = JobCardOperationInsertSchema.partial().parse(data);
  await db.update(jobCardOperation).set({ ...parsed, modified: new Date() }).where(eq(jobCardOperation.id, id));
  return getJobCardOperation(db, id);
}

/**
 * Delete a Job Card Operation by ID.
 */
export async function deleteJobCardOperation(db: any, id: string) {
  await db.delete(jobCardOperation).where(eq(jobCardOperation.id, id));
  return { deleted: true, id };
}
