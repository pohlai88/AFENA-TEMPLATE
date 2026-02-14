// CRUD API handlers for Maintenance Schedule Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { maintenanceScheduleItem } from '../db/schema.js';
import { MaintenanceScheduleItemSchema, MaintenanceScheduleItemInsertSchema } from '../types/maintenance-schedule-item.js';

export const ROUTE_PREFIX = '/maintenance-schedule-item';

/**
 * List Maintenance Schedule Item records.
 */
export async function listMaintenanceScheduleItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(maintenanceScheduleItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Maintenance Schedule Item by ID.
 */
export async function getMaintenanceScheduleItem(db: any, id: string) {
  const rows = await db.select().from(maintenanceScheduleItem).where(eq(maintenanceScheduleItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Maintenance Schedule Item.
 */
export async function createMaintenanceScheduleItem(db: any, data: unknown) {
  const parsed = MaintenanceScheduleItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(maintenanceScheduleItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Maintenance Schedule Item.
 */
export async function updateMaintenanceScheduleItem(db: any, id: string, data: unknown) {
  const parsed = MaintenanceScheduleItemInsertSchema.partial().parse(data);
  await db.update(maintenanceScheduleItem).set({ ...parsed, modified: new Date() }).where(eq(maintenanceScheduleItem.id, id));
  return getMaintenanceScheduleItem(db, id);
}

/**
 * Delete a Maintenance Schedule Item by ID.
 */
export async function deleteMaintenanceScheduleItem(db: any, id: string) {
  await db.delete(maintenanceScheduleItem).where(eq(maintenanceScheduleItem.id, id));
  return { deleted: true, id };
}
