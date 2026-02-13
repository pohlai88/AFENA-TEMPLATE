// CRUD API handlers for Workstation
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { workstation } from '../db/schema.js';
import { WorkstationSchema, WorkstationInsertSchema } from '../types/workstation.js';

export const ROUTE_PREFIX = '/workstation';

/**
 * List Workstation records.
 */
export async function listWorkstation(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(workstation).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Workstation by ID.
 */
export async function getWorkstation(db: any, id: string) {
  const rows = await db.select().from(workstation).where(eq(workstation.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Workstation.
 */
export async function createWorkstation(db: any, data: unknown) {
  const parsed = WorkstationInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(workstation).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Workstation.
 */
export async function updateWorkstation(db: any, id: string, data: unknown) {
  const parsed = WorkstationInsertSchema.partial().parse(data);
  await db.update(workstation).set({ ...parsed, modified: new Date() }).where(eq(workstation.id, id));
  return getWorkstation(db, id);
}

/**
 * Delete a Workstation by ID.
 */
export async function deleteWorkstation(db: any, id: string) {
  await db.delete(workstation).where(eq(workstation.id, id));
  return { deleted: true, id };
}
