// CRUD API handlers for Project
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { project } from '../db/schema.js';
import { ProjectSchema, ProjectInsertSchema } from '../types/project.js';

export const ROUTE_PREFIX = '/project';

/**
 * List Project records.
 */
export async function listProject(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(project).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Project by ID.
 */
export async function getProject(db: any, id: string) {
  const rows = await db.select().from(project).where(eq(project.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Project.
 */
export async function createProject(db: any, data: unknown) {
  const parsed = ProjectInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(project).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Project.
 */
export async function updateProject(db: any, id: string, data: unknown) {
  const parsed = ProjectInsertSchema.partial().parse(data);
  await db.update(project).set({ ...parsed, modified: new Date() }).where(eq(project.id, id));
  return getProject(db, id);
}

/**
 * Delete a Project by ID.
 */
export async function deleteProject(db: any, id: string) {
  await db.delete(project).where(eq(project.id, id));
  return { deleted: true, id };
}
