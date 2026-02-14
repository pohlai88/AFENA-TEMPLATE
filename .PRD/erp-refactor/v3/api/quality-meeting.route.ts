// CRUD API handlers for Quality Meeting
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { qualityMeeting } from '../db/schema.js';
import { QualityMeetingSchema, QualityMeetingInsertSchema } from '../types/quality-meeting.js';

export const ROUTE_PREFIX = '/quality-meeting';

/**
 * List Quality Meeting records.
 */
export async function listQualityMeeting(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(qualityMeeting).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Quality Meeting by ID.
 */
export async function getQualityMeeting(db: any, id: string) {
  const rows = await db.select().from(qualityMeeting).where(eq(qualityMeeting.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Quality Meeting.
 */
export async function createQualityMeeting(db: any, data: unknown) {
  const parsed = QualityMeetingInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(qualityMeeting).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Quality Meeting.
 */
export async function updateQualityMeeting(db: any, id: string, data: unknown) {
  const parsed = QualityMeetingInsertSchema.partial().parse(data);
  await db.update(qualityMeeting).set({ ...parsed, modified: new Date() }).where(eq(qualityMeeting.id, id));
  return getQualityMeeting(db, id);
}

/**
 * Delete a Quality Meeting by ID.
 */
export async function deleteQualityMeeting(db: any, id: string) {
  await db.delete(qualityMeeting).where(eq(qualityMeeting.id, id));
  return { deleted: true, id };
}
