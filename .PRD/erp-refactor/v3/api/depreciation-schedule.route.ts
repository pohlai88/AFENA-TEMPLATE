// CRUD API handlers for Depreciation Schedule
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { depreciationSchedule } from '../db/schema.js';
import { DepreciationScheduleSchema, DepreciationScheduleInsertSchema } from '../types/depreciation-schedule.js';

export const ROUTE_PREFIX = '/depreciation-schedule';

/**
 * List Depreciation Schedule records.
 */
export async function listDepreciationSchedule(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(depreciationSchedule).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Depreciation Schedule by ID.
 */
export async function getDepreciationSchedule(db: any, id: string) {
  const rows = await db.select().from(depreciationSchedule).where(eq(depreciationSchedule.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Depreciation Schedule.
 */
export async function createDepreciationSchedule(db: any, data: unknown) {
  const parsed = DepreciationScheduleInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(depreciationSchedule).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Depreciation Schedule.
 */
export async function updateDepreciationSchedule(db: any, id: string, data: unknown) {
  const parsed = DepreciationScheduleInsertSchema.partial().parse(data);
  await db.update(depreciationSchedule).set({ ...parsed, modified: new Date() }).where(eq(depreciationSchedule.id, id));
  return getDepreciationSchedule(db, id);
}

/**
 * Delete a Depreciation Schedule by ID.
 */
export async function deleteDepreciationSchedule(db: any, id: string) {
  await db.delete(depreciationSchedule).where(eq(depreciationSchedule.id, id));
  return { deleted: true, id };
}
