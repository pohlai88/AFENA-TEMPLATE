// CRUD API handlers for Issue
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { issue } from '../db/schema.js';
import { IssueSchema, IssueInsertSchema } from '../types/issue.js';

export const ROUTE_PREFIX = '/issue';

/**
 * List Issue records.
 */
export async function listIssue(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(issue).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Issue by ID.
 */
export async function getIssue(db: any, id: string) {
  const rows = await db.select().from(issue).where(eq(issue.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Issue.
 */
export async function createIssue(db: any, data: unknown) {
  const parsed = IssueInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(issue).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Issue.
 */
export async function updateIssue(db: any, id: string, data: unknown) {
  const parsed = IssueInsertSchema.partial().parse(data);
  await db.update(issue).set({ ...parsed, modified: new Date() }).where(eq(issue.id, id));
  return getIssue(db, id);
}

/**
 * Delete a Issue by ID.
 */
export async function deleteIssue(db: any, id: string) {
  await db.delete(issue).where(eq(issue.id, id));
  return { deleted: true, id };
}
