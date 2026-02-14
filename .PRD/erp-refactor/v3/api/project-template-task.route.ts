// CRUD API handlers for Project Template Task
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { projectTemplateTask } from '../db/schema.js';
import { ProjectTemplateTaskSchema, ProjectTemplateTaskInsertSchema } from '../types/project-template-task.js';

export const ROUTE_PREFIX = '/project-template-task';

/**
 * List Project Template Task records.
 */
export async function listProjectTemplateTask(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(projectTemplateTask).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Project Template Task by ID.
 */
export async function getProjectTemplateTask(db: any, id: string) {
  const rows = await db.select().from(projectTemplateTask).where(eq(projectTemplateTask.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Project Template Task.
 */
export async function createProjectTemplateTask(db: any, data: unknown) {
  const parsed = ProjectTemplateTaskInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(projectTemplateTask).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Project Template Task.
 */
export async function updateProjectTemplateTask(db: any, id: string, data: unknown) {
  const parsed = ProjectTemplateTaskInsertSchema.partial().parse(data);
  await db.update(projectTemplateTask).set({ ...parsed, modified: new Date() }).where(eq(projectTemplateTask.id, id));
  return getProjectTemplateTask(db, id);
}

/**
 * Delete a Project Template Task by ID.
 */
export async function deleteProjectTemplateTask(db: any, id: string) {
  await db.delete(projectTemplateTask).where(eq(projectTemplateTask.id, id));
  return { deleted: true, id };
}
