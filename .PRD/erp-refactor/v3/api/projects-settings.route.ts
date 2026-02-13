// CRUD API handlers for Projects Settings
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { projectsSettings } from '../db/schema.js';
import { ProjectsSettingsSchema, ProjectsSettingsInsertSchema } from '../types/projects-settings.js';

export const ROUTE_PREFIX = '/projects-settings';

/**
 * List Projects Settings records.
 */
export async function listProjectsSettings(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(projectsSettings).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Projects Settings by ID.
 */
export async function getProjectsSettings(db: any, id: string) {
  const rows = await db.select().from(projectsSettings).where(eq(projectsSettings.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Projects Settings.
 */
export async function createProjectsSettings(db: any, data: unknown) {
  const parsed = ProjectsSettingsInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(projectsSettings).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Projects Settings.
 */
export async function updateProjectsSettings(db: any, id: string, data: unknown) {
  const parsed = ProjectsSettingsInsertSchema.partial().parse(data);
  await db.update(projectsSettings).set({ ...parsed, modified: new Date() }).where(eq(projectsSettings.id, id));
  return getProjectsSettings(db, id);
}

/**
 * Delete a Projects Settings by ID.
 */
export async function deleteProjectsSettings(db: any, id: string) {
  await db.delete(projectsSettings).where(eq(projectsSettings.id, id));
  return { deleted: true, id };
}
