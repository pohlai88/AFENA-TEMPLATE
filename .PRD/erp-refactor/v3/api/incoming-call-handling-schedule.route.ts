// CRUD API handlers for Incoming Call Handling Schedule
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { incomingCallHandlingSchedule } from '../db/schema.js';
import { IncomingCallHandlingScheduleSchema, IncomingCallHandlingScheduleInsertSchema } from '../types/incoming-call-handling-schedule.js';

export const ROUTE_PREFIX = '/incoming-call-handling-schedule';

/**
 * List Incoming Call Handling Schedule records.
 */
export async function listIncomingCallHandlingSchedule(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(incomingCallHandlingSchedule).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Incoming Call Handling Schedule by ID.
 */
export async function getIncomingCallHandlingSchedule(db: any, id: string) {
  const rows = await db.select().from(incomingCallHandlingSchedule).where(eq(incomingCallHandlingSchedule.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Incoming Call Handling Schedule.
 */
export async function createIncomingCallHandlingSchedule(db: any, data: unknown) {
  const parsed = IncomingCallHandlingScheduleInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(incomingCallHandlingSchedule).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Incoming Call Handling Schedule.
 */
export async function updateIncomingCallHandlingSchedule(db: any, id: string, data: unknown) {
  const parsed = IncomingCallHandlingScheduleInsertSchema.partial().parse(data);
  await db.update(incomingCallHandlingSchedule).set({ ...parsed, modified: new Date() }).where(eq(incomingCallHandlingSchedule.id, id));
  return getIncomingCallHandlingSchedule(db, id);
}

/**
 * Delete a Incoming Call Handling Schedule by ID.
 */
export async function deleteIncomingCallHandlingSchedule(db: any, id: string) {
  await db.delete(incomingCallHandlingSchedule).where(eq(incomingCallHandlingSchedule.id, id));
  return { deleted: true, id };
}
