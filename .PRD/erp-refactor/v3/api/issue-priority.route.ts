// CRUD API handlers for Issue Priority
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { issuePriority } from '../db/schema.js';
import { IssuePrioritySchema, IssuePriorityInsertSchema } from '../types/issue-priority.js';

export const ROUTE_PREFIX = '/issue-priority';

/**
 * List Issue Priority records.
 */
export async function listIssuePriority(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(issuePriority).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Issue Priority by ID.
 */
export async function getIssuePriority(db: any, id: string) {
  const rows = await db.select().from(issuePriority).where(eq(issuePriority.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Issue Priority.
 */
export async function createIssuePriority(db: any, data: unknown) {
  const parsed = IssuePriorityInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(issuePriority).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Issue Priority.
 */
export async function updateIssuePriority(db: any, id: string, data: unknown) {
  const parsed = IssuePriorityInsertSchema.partial().parse(data);
  await db.update(issuePriority).set({ ...parsed, modified: new Date() }).where(eq(issuePriority.id, id));
  return getIssuePriority(db, id);
}

/**
 * Delete a Issue Priority by ID.
 */
export async function deleteIssuePriority(db: any, id: string) {
  await db.delete(issuePriority).where(eq(issuePriority.id, id));
  return { deleted: true, id };
}
