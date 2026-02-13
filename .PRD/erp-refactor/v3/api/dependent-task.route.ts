// CRUD API handlers for Dependent Task
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { dependentTask } from '../db/schema.js';
import { DependentTaskSchema, DependentTaskInsertSchema } from '../types/dependent-task.js';

export const ROUTE_PREFIX = '/dependent-task';

/**
 * List Dependent Task records.
 */
export async function listDependentTask(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(dependentTask).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Dependent Task by ID.
 */
export async function getDependentTask(db: any, id: string) {
  const rows = await db.select().from(dependentTask).where(eq(dependentTask.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Dependent Task.
 */
export async function createDependentTask(db: any, data: unknown) {
  const parsed = DependentTaskInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(dependentTask).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Dependent Task.
 */
export async function updateDependentTask(db: any, id: string, data: unknown) {
  const parsed = DependentTaskInsertSchema.partial().parse(data);
  await db.update(dependentTask).set({ ...parsed, modified: new Date() }).where(eq(dependentTask.id, id));
  return getDependentTask(db, id);
}

/**
 * Delete a Dependent Task by ID.
 */
export async function deleteDependentTask(db: any, id: string) {
  await db.delete(dependentTask).where(eq(dependentTask.id, id));
  return { deleted: true, id };
}
