// CRUD API handlers for Task Depends On
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { taskDependsOn } from '../db/schema.js';
import { TaskDependsOnSchema, TaskDependsOnInsertSchema } from '../types/task-depends-on.js';

export const ROUTE_PREFIX = '/task-depends-on';

/**
 * List Task Depends On records.
 */
export async function listTaskDependsOn(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(taskDependsOn).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Task Depends On by ID.
 */
export async function getTaskDependsOn(db: any, id: string) {
  const rows = await db.select().from(taskDependsOn).where(eq(taskDependsOn.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Task Depends On.
 */
export async function createTaskDependsOn(db: any, data: unknown) {
  const parsed = TaskDependsOnInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(taskDependsOn).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Task Depends On.
 */
export async function updateTaskDependsOn(db: any, id: string, data: unknown) {
  const parsed = TaskDependsOnInsertSchema.partial().parse(data);
  await db.update(taskDependsOn).set({ ...parsed, modified: new Date() }).where(eq(taskDependsOn.id, id));
  return getTaskDependsOn(db, id);
}

/**
 * Delete a Task Depends On by ID.
 */
export async function deleteTaskDependsOn(db: any, id: string) {
  await db.delete(taskDependsOn).where(eq(taskDependsOn.id, id));
  return { deleted: true, id };
}
