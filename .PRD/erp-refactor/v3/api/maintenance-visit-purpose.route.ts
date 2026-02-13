// CRUD API handlers for Maintenance Visit Purpose
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { maintenanceVisitPurpose } from '../db/schema.js';
import { MaintenanceVisitPurposeSchema, MaintenanceVisitPurposeInsertSchema } from '../types/maintenance-visit-purpose.js';

export const ROUTE_PREFIX = '/maintenance-visit-purpose';

/**
 * List Maintenance Visit Purpose records.
 */
export async function listMaintenanceVisitPurpose(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(maintenanceVisitPurpose).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Maintenance Visit Purpose by ID.
 */
export async function getMaintenanceVisitPurpose(db: any, id: string) {
  const rows = await db.select().from(maintenanceVisitPurpose).where(eq(maintenanceVisitPurpose.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Maintenance Visit Purpose.
 */
export async function createMaintenanceVisitPurpose(db: any, data: unknown) {
  const parsed = MaintenanceVisitPurposeInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(maintenanceVisitPurpose).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Maintenance Visit Purpose.
 */
export async function updateMaintenanceVisitPurpose(db: any, id: string, data: unknown) {
  const parsed = MaintenanceVisitPurposeInsertSchema.partial().parse(data);
  await db.update(maintenanceVisitPurpose).set({ ...parsed, modified: new Date() }).where(eq(maintenanceVisitPurpose.id, id));
  return getMaintenanceVisitPurpose(db, id);
}

/**
 * Delete a Maintenance Visit Purpose by ID.
 */
export async function deleteMaintenanceVisitPurpose(db: any, id: string) {
  await db.delete(maintenanceVisitPurpose).where(eq(maintenanceVisitPurpose.id, id));
  return { deleted: true, id };
}
