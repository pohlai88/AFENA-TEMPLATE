// CRUD API handlers for Project Update
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { projectUpdate } from '../db/schema.js';
import { ProjectUpdateSchema, ProjectUpdateInsertSchema } from '../types/project-update.js';

export const ROUTE_PREFIX = '/project-update';

/**
 * List Project Update records.
 */
export async function listProjectUpdate(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(projectUpdate).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Project Update by ID.
 */
export async function getProjectUpdate(db: any, id: string) {
  const rows = await db.select().from(projectUpdate).where(eq(projectUpdate.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Project Update.
 */
export async function createProjectUpdate(db: any, data: unknown) {
  const parsed = ProjectUpdateInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(projectUpdate).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Project Update.
 */
export async function updateProjectUpdate(db: any, id: string, data: unknown) {
  const parsed = ProjectUpdateInsertSchema.partial().parse(data);
  await db.update(projectUpdate).set({ ...parsed, modified: new Date() }).where(eq(projectUpdate.id, id));
  return getProjectUpdate(db, id);
}

/**
 * Delete a Project Update by ID.
 */
export async function deleteProjectUpdate(db: any, id: string) {
  await db.delete(projectUpdate).where(eq(projectUpdate.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Project Update (set docstatus = 1).
 */
export async function submitProjectUpdate(db: any, id: string) {
  await db.update(projectUpdate).set({ docstatus: 1, modified: new Date() }).where(eq(projectUpdate.id, id));
  return getProjectUpdate(db, id);
}

/**
 * Cancel a Project Update (set docstatus = 2).
 */
export async function cancelProjectUpdate(db: any, id: string) {
  await db.update(projectUpdate).set({ docstatus: 2, modified: new Date() }).where(eq(projectUpdate.id, id));
  return getProjectUpdate(db, id);
}
