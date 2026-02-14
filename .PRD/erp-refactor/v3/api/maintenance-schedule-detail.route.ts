// CRUD API handlers for Maintenance Schedule Detail
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { maintenanceScheduleDetail } from '../db/schema.js';
import { MaintenanceScheduleDetailSchema, MaintenanceScheduleDetailInsertSchema } from '../types/maintenance-schedule-detail.js';

export const ROUTE_PREFIX = '/maintenance-schedule-detail';

/**
 * List Maintenance Schedule Detail records.
 */
export async function listMaintenanceScheduleDetail(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(maintenanceScheduleDetail).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Maintenance Schedule Detail by ID.
 */
export async function getMaintenanceScheduleDetail(db: any, id: string) {
  const rows = await db.select().from(maintenanceScheduleDetail).where(eq(maintenanceScheduleDetail.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Maintenance Schedule Detail.
 */
export async function createMaintenanceScheduleDetail(db: any, data: unknown) {
  const parsed = MaintenanceScheduleDetailInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(maintenanceScheduleDetail).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Maintenance Schedule Detail.
 */
export async function updateMaintenanceScheduleDetail(db: any, id: string, data: unknown) {
  const parsed = MaintenanceScheduleDetailInsertSchema.partial().parse(data);
  await db.update(maintenanceScheduleDetail).set({ ...parsed, modified: new Date() }).where(eq(maintenanceScheduleDetail.id, id));
  return getMaintenanceScheduleDetail(db, id);
}

/**
 * Delete a Maintenance Schedule Detail by ID.
 */
export async function deleteMaintenanceScheduleDetail(db: any, id: string) {
  await db.delete(maintenanceScheduleDetail).where(eq(maintenanceScheduleDetail.id, id));
  return { deleted: true, id };
}
