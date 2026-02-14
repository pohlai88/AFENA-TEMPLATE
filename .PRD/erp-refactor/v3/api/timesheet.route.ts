// CRUD API handlers for Timesheet
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { timesheet } from '../db/schema.js';
import { TimesheetSchema, TimesheetInsertSchema } from '../types/timesheet.js';

export const ROUTE_PREFIX = '/timesheet';

/**
 * List Timesheet records.
 */
export async function listTimesheet(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(timesheet).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Timesheet by ID.
 */
export async function getTimesheet(db: any, id: string) {
  const rows = await db.select().from(timesheet).where(eq(timesheet.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Timesheet.
 */
export async function createTimesheet(db: any, data: unknown) {
  const parsed = TimesheetInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(timesheet).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Timesheet.
 */
export async function updateTimesheet(db: any, id: string, data: unknown) {
  const parsed = TimesheetInsertSchema.partial().parse(data);
  await db.update(timesheet).set({ ...parsed, modified: new Date() }).where(eq(timesheet.id, id));
  return getTimesheet(db, id);
}

/**
 * Delete a Timesheet by ID.
 */
export async function deleteTimesheet(db: any, id: string) {
  await db.delete(timesheet).where(eq(timesheet.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Timesheet (set docstatus = 1).
 */
export async function submitTimesheet(db: any, id: string) {
  await db.update(timesheet).set({ docstatus: 1, modified: new Date() }).where(eq(timesheet.id, id));
  return getTimesheet(db, id);
}

/**
 * Cancel a Timesheet (set docstatus = 2).
 */
export async function cancelTimesheet(db: any, id: string) {
  await db.update(timesheet).set({ docstatus: 2, modified: new Date() }).where(eq(timesheet.id, id));
  return getTimesheet(db, id);
}
