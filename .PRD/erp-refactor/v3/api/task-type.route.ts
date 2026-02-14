// CRUD API handlers for Task Type
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { taskType } from '../db/schema.js';
import { TaskTypeSchema, TaskTypeInsertSchema } from '../types/task-type.js';

export const ROUTE_PREFIX = '/task-type';

/**
 * List Task Type records.
 */
export async function listTaskType(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(taskType).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Task Type by ID.
 */
export async function getTaskType(db: any, id: string) {
  const rows = await db.select().from(taskType).where(eq(taskType.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Task Type.
 */
export async function createTaskType(db: any, data: unknown) {
  const parsed = TaskTypeInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(taskType).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Task Type.
 */
export async function updateTaskType(db: any, id: string, data: unknown) {
  const parsed = TaskTypeInsertSchema.partial().parse(data);
  await db.update(taskType).set({ ...parsed, modified: new Date() }).where(eq(taskType.id, id));
  return getTaskType(db, id);
}

/**
 * Delete a Task Type by ID.
 */
export async function deleteTaskType(db: any, id: string) {
  await db.delete(taskType).where(eq(taskType.id, id));
  return { deleted: true, id };
}
