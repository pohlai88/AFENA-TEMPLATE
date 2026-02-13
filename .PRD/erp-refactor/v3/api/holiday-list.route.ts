// CRUD API handlers for Holiday List
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { holidayList } from '../db/schema.js';
import { HolidayListSchema, HolidayListInsertSchema } from '../types/holiday-list.js';

export const ROUTE_PREFIX = '/holiday-list';

/**
 * List Holiday List records.
 */
export async function listHolidayList(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(holidayList).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Holiday List by ID.
 */
export async function getHolidayList(db: any, id: string) {
  const rows = await db.select().from(holidayList).where(eq(holidayList.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Holiday List.
 */
export async function createHolidayList(db: any, data: unknown) {
  const parsed = HolidayListInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(holidayList).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Holiday List.
 */
export async function updateHolidayList(db: any, id: string, data: unknown) {
  const parsed = HolidayListInsertSchema.partial().parse(data);
  await db.update(holidayList).set({ ...parsed, modified: new Date() }).where(eq(holidayList.id, id));
  return getHolidayList(db, id);
}

/**
 * Delete a Holiday List by ID.
 */
export async function deleteHolidayList(db: any, id: string) {
  await db.delete(holidayList).where(eq(holidayList.id, id));
  return { deleted: true, id };
}
