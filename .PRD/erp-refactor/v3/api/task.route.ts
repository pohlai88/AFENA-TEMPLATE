// CRUD API handlers for Task
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { task } from '../db/schema.js';
import { TaskSchema, TaskInsertSchema } from '../types/task.js';

export const ROUTE_PREFIX = '/task';

/**
 * List Task records.
 */
export async function listTask(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(task).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Task by ID.
 */
export async function getTask(db: any, id: string) {
  const rows = await db.select().from(task).where(eq(task.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Task.
 */
export async function createTask(db: any, data: unknown) {
  const parsed = TaskInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(task).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Task.
 */
export async function updateTask(db: any, id: string, data: unknown) {
  const parsed = TaskInsertSchema.partial().parse(data);
  await db.update(task).set({ ...parsed, modified: new Date() }).where(eq(task.id, id));
  return getTask(db, id);
}

/**
 * Delete a Task by ID.
 */
export async function deleteTask(db: any, id: string) {
  await db.delete(task).where(eq(task.id, id));
  return { deleted: true, id };
}
