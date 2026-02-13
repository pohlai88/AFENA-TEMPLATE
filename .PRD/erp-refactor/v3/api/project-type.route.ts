// CRUD API handlers for Project Type
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { projectType } from '../db/schema.js';
import { ProjectTypeSchema, ProjectTypeInsertSchema } from '../types/project-type.js';

export const ROUTE_PREFIX = '/project-type';

/**
 * List Project Type records.
 */
export async function listProjectType(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(projectType).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Project Type by ID.
 */
export async function getProjectType(db: any, id: string) {
  const rows = await db.select().from(projectType).where(eq(projectType.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Project Type.
 */
export async function createProjectType(db: any, data: unknown) {
  const parsed = ProjectTypeInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(projectType).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Project Type.
 */
export async function updateProjectType(db: any, id: string, data: unknown) {
  const parsed = ProjectTypeInsertSchema.partial().parse(data);
  await db.update(projectType).set({ ...parsed, modified: new Date() }).where(eq(projectType.id, id));
  return getProjectType(db, id);
}

/**
 * Delete a Project Type by ID.
 */
export async function deleteProjectType(db: any, id: string) {
  await db.delete(projectType).where(eq(projectType.id, id));
  return { deleted: true, id };
}
