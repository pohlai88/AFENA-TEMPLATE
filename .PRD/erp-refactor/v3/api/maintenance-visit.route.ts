// CRUD API handlers for Maintenance Visit
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { maintenanceVisit } from '../db/schema.js';
import { MaintenanceVisitSchema, MaintenanceVisitInsertSchema } from '../types/maintenance-visit.js';

export const ROUTE_PREFIX = '/maintenance-visit';

/**
 * List Maintenance Visit records.
 */
export async function listMaintenanceVisit(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(maintenanceVisit).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Maintenance Visit by ID.
 */
export async function getMaintenanceVisit(db: any, id: string) {
  const rows = await db.select().from(maintenanceVisit).where(eq(maintenanceVisit.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Maintenance Visit.
 */
export async function createMaintenanceVisit(db: any, data: unknown) {
  const parsed = MaintenanceVisitInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(maintenanceVisit).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Maintenance Visit.
 */
export async function updateMaintenanceVisit(db: any, id: string, data: unknown) {
  const parsed = MaintenanceVisitInsertSchema.partial().parse(data);
  await db.update(maintenanceVisit).set({ ...parsed, modified: new Date() }).where(eq(maintenanceVisit.id, id));
  return getMaintenanceVisit(db, id);
}

/**
 * Delete a Maintenance Visit by ID.
 */
export async function deleteMaintenanceVisit(db: any, id: string) {
  await db.delete(maintenanceVisit).where(eq(maintenanceVisit.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Maintenance Visit (set docstatus = 1).
 */
export async function submitMaintenanceVisit(db: any, id: string) {
  await db.update(maintenanceVisit).set({ docstatus: 1, modified: new Date() }).where(eq(maintenanceVisit.id, id));
  return getMaintenanceVisit(db, id);
}

/**
 * Cancel a Maintenance Visit (set docstatus = 2).
 */
export async function cancelMaintenanceVisit(db: any, id: string) {
  await db.update(maintenanceVisit).set({ docstatus: 2, modified: new Date() }).where(eq(maintenanceVisit.id, id));
  return getMaintenanceVisit(db, id);
}
