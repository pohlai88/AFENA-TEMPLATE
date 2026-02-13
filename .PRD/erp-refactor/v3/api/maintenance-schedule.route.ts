// CRUD API handlers for Maintenance Schedule
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { maintenanceSchedule } from '../db/schema.js';
import { MaintenanceScheduleSchema, MaintenanceScheduleInsertSchema } from '../types/maintenance-schedule.js';

export const ROUTE_PREFIX = '/maintenance-schedule';

/**
 * List Maintenance Schedule records.
 */
export async function listMaintenanceSchedule(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(maintenanceSchedule).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Maintenance Schedule by ID.
 */
export async function getMaintenanceSchedule(db: any, id: string) {
  const rows = await db.select().from(maintenanceSchedule).where(eq(maintenanceSchedule.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Maintenance Schedule.
 */
export async function createMaintenanceSchedule(db: any, data: unknown) {
  const parsed = MaintenanceScheduleInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(maintenanceSchedule).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Maintenance Schedule.
 */
export async function updateMaintenanceSchedule(db: any, id: string, data: unknown) {
  const parsed = MaintenanceScheduleInsertSchema.partial().parse(data);
  await db.update(maintenanceSchedule).set({ ...parsed, modified: new Date() }).where(eq(maintenanceSchedule.id, id));
  return getMaintenanceSchedule(db, id);
}

/**
 * Delete a Maintenance Schedule by ID.
 */
export async function deleteMaintenanceSchedule(db: any, id: string) {
  await db.delete(maintenanceSchedule).where(eq(maintenanceSchedule.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Maintenance Schedule (set docstatus = 1).
 */
export async function submitMaintenanceSchedule(db: any, id: string) {
  await db.update(maintenanceSchedule).set({ docstatus: 1, modified: new Date() }).where(eq(maintenanceSchedule.id, id));
  return getMaintenanceSchedule(db, id);
}

/**
 * Cancel a Maintenance Schedule (set docstatus = 2).
 */
export async function cancelMaintenanceSchedule(db: any, id: string) {
  await db.update(maintenanceSchedule).set({ docstatus: 2, modified: new Date() }).where(eq(maintenanceSchedule.id, id));
  return getMaintenanceSchedule(db, id);
}
