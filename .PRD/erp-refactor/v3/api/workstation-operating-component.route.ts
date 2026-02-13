// CRUD API handlers for Workstation Operating Component
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { workstationOperatingComponent } from '../db/schema.js';
import { WorkstationOperatingComponentSchema, WorkstationOperatingComponentInsertSchema } from '../types/workstation-operating-component.js';

export const ROUTE_PREFIX = '/workstation-operating-component';

/**
 * List Workstation Operating Component records.
 */
export async function listWorkstationOperatingComponent(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(workstationOperatingComponent).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Workstation Operating Component by ID.
 */
export async function getWorkstationOperatingComponent(db: any, id: string) {
  const rows = await db.select().from(workstationOperatingComponent).where(eq(workstationOperatingComponent.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Workstation Operating Component.
 */
export async function createWorkstationOperatingComponent(db: any, data: unknown) {
  const parsed = WorkstationOperatingComponentInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(workstationOperatingComponent).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Workstation Operating Component.
 */
export async function updateWorkstationOperatingComponent(db: any, id: string, data: unknown) {
  const parsed = WorkstationOperatingComponentInsertSchema.partial().parse(data);
  await db.update(workstationOperatingComponent).set({ ...parsed, modified: new Date() }).where(eq(workstationOperatingComponent.id, id));
  return getWorkstationOperatingComponent(db, id);
}

/**
 * Delete a Workstation Operating Component by ID.
 */
export async function deleteWorkstationOperatingComponent(db: any, id: string) {
  await db.delete(workstationOperatingComponent).where(eq(workstationOperatingComponent.id, id));
  return { deleted: true, id };
}
