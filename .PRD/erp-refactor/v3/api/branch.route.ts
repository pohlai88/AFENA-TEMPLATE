// CRUD API handlers for Branch
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { branch } from '../db/schema.js';
import { BranchSchema, BranchInsertSchema } from '../types/branch.js';

export const ROUTE_PREFIX = '/branch';

/**
 * List Branch records.
 */
export async function listBranch(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(branch).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Branch by ID.
 */
export async function getBranch(db: any, id: string) {
  const rows = await db.select().from(branch).where(eq(branch.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Branch.
 */
export async function createBranch(db: any, data: unknown) {
  const parsed = BranchInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(branch).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Branch.
 */
export async function updateBranch(db: any, id: string, data: unknown) {
  const parsed = BranchInsertSchema.partial().parse(data);
  await db.update(branch).set({ ...parsed, modified: new Date() }).where(eq(branch.id, id));
  return getBranch(db, id);
}

/**
 * Delete a Branch by ID.
 */
export async function deleteBranch(db: any, id: string) {
  await db.delete(branch).where(eq(branch.id, id));
  return { deleted: true, id };
}
