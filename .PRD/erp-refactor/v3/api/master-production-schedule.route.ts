// CRUD API handlers for Master Production Schedule
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { masterProductionSchedule } from '../db/schema.js';
import { MasterProductionScheduleSchema, MasterProductionScheduleInsertSchema } from '../types/master-production-schedule.js';

export const ROUTE_PREFIX = '/master-production-schedule';

/**
 * List Master Production Schedule records.
 */
export async function listMasterProductionSchedule(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(masterProductionSchedule).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Master Production Schedule by ID.
 */
export async function getMasterProductionSchedule(db: any, id: string) {
  const rows = await db.select().from(masterProductionSchedule).where(eq(masterProductionSchedule.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Master Production Schedule.
 */
export async function createMasterProductionSchedule(db: any, data: unknown) {
  const parsed = MasterProductionScheduleInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(masterProductionSchedule).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Master Production Schedule.
 */
export async function updateMasterProductionSchedule(db: any, id: string, data: unknown) {
  const parsed = MasterProductionScheduleInsertSchema.partial().parse(data);
  await db.update(masterProductionSchedule).set({ ...parsed, modified: new Date() }).where(eq(masterProductionSchedule.id, id));
  return getMasterProductionSchedule(db, id);
}

/**
 * Delete a Master Production Schedule by ID.
 */
export async function deleteMasterProductionSchedule(db: any, id: string) {
  await db.delete(masterProductionSchedule).where(eq(masterProductionSchedule.id, id));
  return { deleted: true, id };
}
