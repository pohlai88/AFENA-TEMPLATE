// CRUD API handlers for Workstation Type
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { workstationType } from '../db/schema.js';
import { WorkstationTypeSchema, WorkstationTypeInsertSchema } from '../types/workstation-type.js';

export const ROUTE_PREFIX = '/workstation-type';

/**
 * List Workstation Type records.
 */
export async function listWorkstationType(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(workstationType).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Workstation Type by ID.
 */
export async function getWorkstationType(db: any, id: string) {
  const rows = await db.select().from(workstationType).where(eq(workstationType.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Workstation Type.
 */
export async function createWorkstationType(db: any, data: unknown) {
  const parsed = WorkstationTypeInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(workstationType).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Workstation Type.
 */
export async function updateWorkstationType(db: any, id: string, data: unknown) {
  const parsed = WorkstationTypeInsertSchema.partial().parse(data);
  await db.update(workstationType).set({ ...parsed, modified: new Date() }).where(eq(workstationType.id, id));
  return getWorkstationType(db, id);
}

/**
 * Delete a Workstation Type by ID.
 */
export async function deleteWorkstationType(db: any, id: string) {
  await db.delete(workstationType).where(eq(workstationType.id, id));
  return { deleted: true, id };
}
