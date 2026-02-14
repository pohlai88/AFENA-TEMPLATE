// CRUD API handlers for Project Template
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { projectTemplate } from '../db/schema.js';
import { ProjectTemplateSchema, ProjectTemplateInsertSchema } from '../types/project-template.js';

export const ROUTE_PREFIX = '/project-template';

/**
 * List Project Template records.
 */
export async function listProjectTemplate(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(projectTemplate).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Project Template by ID.
 */
export async function getProjectTemplate(db: any, id: string) {
  const rows = await db.select().from(projectTemplate).where(eq(projectTemplate.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Project Template.
 */
export async function createProjectTemplate(db: any, data: unknown) {
  const parsed = ProjectTemplateInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(projectTemplate).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Project Template.
 */
export async function updateProjectTemplate(db: any, id: string, data: unknown) {
  const parsed = ProjectTemplateInsertSchema.partial().parse(data);
  await db.update(projectTemplate).set({ ...parsed, modified: new Date() }).where(eq(projectTemplate.id, id));
  return getProjectTemplate(db, id);
}

/**
 * Delete a Project Template by ID.
 */
export async function deleteProjectTemplate(db: any, id: string) {
  await db.delete(projectTemplate).where(eq(projectTemplate.id, id));
  return { deleted: true, id };
}
