// CRUD API handlers for Timesheet Detail
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { timesheetDetail } from '../db/schema.js';
import { TimesheetDetailSchema, TimesheetDetailInsertSchema } from '../types/timesheet-detail.js';

export const ROUTE_PREFIX = '/timesheet-detail';

/**
 * List Timesheet Detail records.
 */
export async function listTimesheetDetail(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(timesheetDetail).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Timesheet Detail by ID.
 */
export async function getTimesheetDetail(db: any, id: string) {
  const rows = await db.select().from(timesheetDetail).where(eq(timesheetDetail.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Timesheet Detail.
 */
export async function createTimesheetDetail(db: any, data: unknown) {
  const parsed = TimesheetDetailInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(timesheetDetail).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Timesheet Detail.
 */
export async function updateTimesheetDetail(db: any, id: string, data: unknown) {
  const parsed = TimesheetDetailInsertSchema.partial().parse(data);
  await db.update(timesheetDetail).set({ ...parsed, modified: new Date() }).where(eq(timesheetDetail.id, id));
  return getTimesheetDetail(db, id);
}

/**
 * Delete a Timesheet Detail by ID.
 */
export async function deleteTimesheetDetail(db: any, id: string) {
  await db.delete(timesheetDetail).where(eq(timesheetDetail.id, id));
  return { deleted: true, id };
}
