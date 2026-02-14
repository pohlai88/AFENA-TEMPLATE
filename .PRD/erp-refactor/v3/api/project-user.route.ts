// CRUD API handlers for Project User
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { projectUser } from '../db/schema.js';
import { ProjectUserSchema, ProjectUserInsertSchema } from '../types/project-user.js';

export const ROUTE_PREFIX = '/project-user';

/**
 * List Project User records.
 */
export async function listProjectUser(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(projectUser).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Project User by ID.
 */
export async function getProjectUser(db: any, id: string) {
  const rows = await db.select().from(projectUser).where(eq(projectUser.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Project User.
 */
export async function createProjectUser(db: any, data: unknown) {
  const parsed = ProjectUserInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(projectUser).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Project User.
 */
export async function updateProjectUser(db: any, id: string, data: unknown) {
  const parsed = ProjectUserInsertSchema.partial().parse(data);
  await db.update(projectUser).set({ ...parsed, modified: new Date() }).where(eq(projectUser.id, id));
  return getProjectUser(db, id);
}

/**
 * Delete a Project User by ID.
 */
export async function deleteProjectUser(db: any, id: string) {
  await db.delete(projectUser).where(eq(projectUser.id, id));
  return { deleted: true, id };
}
