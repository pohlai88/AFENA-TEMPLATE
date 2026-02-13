// CRUD API handlers for PSOA Project
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { psoaProject } from '../db/schema.js';
import { PsoaProjectSchema, PsoaProjectInsertSchema } from '../types/psoa-project.js';

export const ROUTE_PREFIX = '/psoa-project';

/**
 * List PSOA Project records.
 */
export async function listPsoaProject(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(psoaProject).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single PSOA Project by ID.
 */
export async function getPsoaProject(db: any, id: string) {
  const rows = await db.select().from(psoaProject).where(eq(psoaProject.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new PSOA Project.
 */
export async function createPsoaProject(db: any, data: unknown) {
  const parsed = PsoaProjectInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(psoaProject).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing PSOA Project.
 */
export async function updatePsoaProject(db: any, id: string, data: unknown) {
  const parsed = PsoaProjectInsertSchema.partial().parse(data);
  await db.update(psoaProject).set({ ...parsed, modified: new Date() }).where(eq(psoaProject.id, id));
  return getPsoaProject(db, id);
}

/**
 * Delete a PSOA Project by ID.
 */
export async function deletePsoaProject(db: any, id: string) {
  await db.delete(psoaProject).where(eq(psoaProject.id, id));
  return { deleted: true, id };
}
