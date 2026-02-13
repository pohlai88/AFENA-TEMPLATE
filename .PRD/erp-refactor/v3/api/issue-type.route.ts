// CRUD API handlers for Issue Type
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { issueType } from '../db/schema.js';
import { IssueTypeSchema, IssueTypeInsertSchema } from '../types/issue-type.js';

export const ROUTE_PREFIX = '/issue-type';

/**
 * List Issue Type records.
 */
export async function listIssueType(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(issueType).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Issue Type by ID.
 */
export async function getIssueType(db: any, id: string) {
  const rows = await db.select().from(issueType).where(eq(issueType.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Issue Type.
 */
export async function createIssueType(db: any, data: unknown) {
  const parsed = IssueTypeInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(issueType).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Issue Type.
 */
export async function updateIssueType(db: any, id: string, data: unknown) {
  const parsed = IssueTypeInsertSchema.partial().parse(data);
  await db.update(issueType).set({ ...parsed, modified: new Date() }).where(eq(issueType.id, id));
  return getIssueType(db, id);
}

/**
 * Delete a Issue Type by ID.
 */
export async function deleteIssueType(db: any, id: string) {
  await db.delete(issueType).where(eq(issueType.id, id));
  return { deleted: true, id };
}
