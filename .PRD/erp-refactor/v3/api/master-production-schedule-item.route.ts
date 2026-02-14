// CRUD API handlers for Master Production Schedule Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { masterProductionScheduleItem } from '../db/schema.js';
import { MasterProductionScheduleItemSchema, MasterProductionScheduleItemInsertSchema } from '../types/master-production-schedule-item.js';

export const ROUTE_PREFIX = '/master-production-schedule-item';

/**
 * List Master Production Schedule Item records.
 */
export async function listMasterProductionScheduleItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(masterProductionScheduleItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Master Production Schedule Item by ID.
 */
export async function getMasterProductionScheduleItem(db: any, id: string) {
  const rows = await db.select().from(masterProductionScheduleItem).where(eq(masterProductionScheduleItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Master Production Schedule Item.
 */
export async function createMasterProductionScheduleItem(db: any, data: unknown) {
  const parsed = MasterProductionScheduleItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(masterProductionScheduleItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Master Production Schedule Item.
 */
export async function updateMasterProductionScheduleItem(db: any, id: string, data: unknown) {
  const parsed = MasterProductionScheduleItemInsertSchema.partial().parse(data);
  await db.update(masterProductionScheduleItem).set({ ...parsed, modified: new Date() }).where(eq(masterProductionScheduleItem.id, id));
  return getMasterProductionScheduleItem(db, id);
}

/**
 * Delete a Master Production Schedule Item by ID.
 */
export async function deleteMasterProductionScheduleItem(db: any, id: string) {
  await db.delete(masterProductionScheduleItem).where(eq(masterProductionScheduleItem.id, id));
  return { deleted: true, id };
}
