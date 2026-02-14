// CRUD API handlers for Workstation Working Hour
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { workstationWorkingHour } from '../db/schema.js';
import { WorkstationWorkingHourSchema, WorkstationWorkingHourInsertSchema } from '../types/workstation-working-hour.js';

export const ROUTE_PREFIX = '/workstation-working-hour';

/**
 * List Workstation Working Hour records.
 */
export async function listWorkstationWorkingHour(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(workstationWorkingHour).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Workstation Working Hour by ID.
 */
export async function getWorkstationWorkingHour(db: any, id: string) {
  const rows = await db.select().from(workstationWorkingHour).where(eq(workstationWorkingHour.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Workstation Working Hour.
 */
export async function createWorkstationWorkingHour(db: any, data: unknown) {
  const parsed = WorkstationWorkingHourInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(workstationWorkingHour).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Workstation Working Hour.
 */
export async function updateWorkstationWorkingHour(db: any, id: string, data: unknown) {
  const parsed = WorkstationWorkingHourInsertSchema.partial().parse(data);
  await db.update(workstationWorkingHour).set({ ...parsed, modified: new Date() }).where(eq(workstationWorkingHour.id, id));
  return getWorkstationWorkingHour(db, id);
}

/**
 * Delete a Workstation Working Hour by ID.
 */
export async function deleteWorkstationWorkingHour(db: any, id: string) {
  await db.delete(workstationWorkingHour).where(eq(workstationWorkingHour.id, id));
  return { deleted: true, id };
}
