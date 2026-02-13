// CRUD API handlers for Holiday
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { holiday } from '../db/schema.js';
import { HolidaySchema, HolidayInsertSchema } from '../types/holiday.js';

export const ROUTE_PREFIX = '/holiday';

/**
 * List Holiday records.
 */
export async function listHoliday(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(holiday).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Holiday by ID.
 */
export async function getHoliday(db: any, id: string) {
  const rows = await db.select().from(holiday).where(eq(holiday.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Holiday.
 */
export async function createHoliday(db: any, data: unknown) {
  const parsed = HolidayInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(holiday).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Holiday.
 */
export async function updateHoliday(db: any, id: string, data: unknown) {
  const parsed = HolidayInsertSchema.partial().parse(data);
  await db.update(holiday).set({ ...parsed, modified: new Date() }).where(eq(holiday.id, id));
  return getHoliday(db, id);
}

/**
 * Delete a Holiday by ID.
 */
export async function deleteHoliday(db: any, id: string) {
  await db.delete(holiday).where(eq(holiday.id, id));
  return { deleted: true, id };
}
