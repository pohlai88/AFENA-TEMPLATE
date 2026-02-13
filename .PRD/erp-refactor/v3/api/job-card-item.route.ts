// CRUD API handlers for Job Card Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { jobCardItem } from '../db/schema.js';
import { JobCardItemSchema, JobCardItemInsertSchema } from '../types/job-card-item.js';

export const ROUTE_PREFIX = '/job-card-item';

/**
 * List Job Card Item records.
 */
export async function listJobCardItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(jobCardItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Job Card Item by ID.
 */
export async function getJobCardItem(db: any, id: string) {
  const rows = await db.select().from(jobCardItem).where(eq(jobCardItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Job Card Item.
 */
export async function createJobCardItem(db: any, data: unknown) {
  const parsed = JobCardItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(jobCardItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Job Card Item.
 */
export async function updateJobCardItem(db: any, id: string, data: unknown) {
  const parsed = JobCardItemInsertSchema.partial().parse(data);
  await db.update(jobCardItem).set({ ...parsed, modified: new Date() }).where(eq(jobCardItem.id, id));
  return getJobCardItem(db, id);
}

/**
 * Delete a Job Card Item by ID.
 */
export async function deleteJobCardItem(db: any, id: string) {
  await db.delete(jobCardItem).where(eq(jobCardItem.id, id));
  return { deleted: true, id };
}
