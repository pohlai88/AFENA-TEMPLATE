// CRUD API handlers for Job Card Scrap Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { jobCardScrapItem } from '../db/schema.js';
import { JobCardScrapItemSchema, JobCardScrapItemInsertSchema } from '../types/job-card-scrap-item.js';

export const ROUTE_PREFIX = '/job-card-scrap-item';

/**
 * List Job Card Scrap Item records.
 */
export async function listJobCardScrapItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(jobCardScrapItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Job Card Scrap Item by ID.
 */
export async function getJobCardScrapItem(db: any, id: string) {
  const rows = await db.select().from(jobCardScrapItem).where(eq(jobCardScrapItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Job Card Scrap Item.
 */
export async function createJobCardScrapItem(db: any, data: unknown) {
  const parsed = JobCardScrapItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(jobCardScrapItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Job Card Scrap Item.
 */
export async function updateJobCardScrapItem(db: any, id: string, data: unknown) {
  const parsed = JobCardScrapItemInsertSchema.partial().parse(data);
  await db.update(jobCardScrapItem).set({ ...parsed, modified: new Date() }).where(eq(jobCardScrapItem.id, id));
  return getJobCardScrapItem(db, id);
}

/**
 * Delete a Job Card Scrap Item by ID.
 */
export async function deleteJobCardScrapItem(db: any, id: string) {
  await db.delete(jobCardScrapItem).where(eq(jobCardScrapItem.id, id));
  return { deleted: true, id };
}
