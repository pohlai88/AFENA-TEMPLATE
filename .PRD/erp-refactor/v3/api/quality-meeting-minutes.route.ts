// CRUD API handlers for Quality Meeting Minutes
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { qualityMeetingMinutes } from '../db/schema.js';
import { QualityMeetingMinutesSchema, QualityMeetingMinutesInsertSchema } from '../types/quality-meeting-minutes.js';

export const ROUTE_PREFIX = '/quality-meeting-minutes';

/**
 * List Quality Meeting Minutes records.
 */
export async function listQualityMeetingMinutes(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(qualityMeetingMinutes).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Quality Meeting Minutes by ID.
 */
export async function getQualityMeetingMinutes(db: any, id: string) {
  const rows = await db.select().from(qualityMeetingMinutes).where(eq(qualityMeetingMinutes.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Quality Meeting Minutes.
 */
export async function createQualityMeetingMinutes(db: any, data: unknown) {
  const parsed = QualityMeetingMinutesInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(qualityMeetingMinutes).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Quality Meeting Minutes.
 */
export async function updateQualityMeetingMinutes(db: any, id: string, data: unknown) {
  const parsed = QualityMeetingMinutesInsertSchema.partial().parse(data);
  await db.update(qualityMeetingMinutes).set({ ...parsed, modified: new Date() }).where(eq(qualityMeetingMinutes.id, id));
  return getQualityMeetingMinutes(db, id);
}

/**
 * Delete a Quality Meeting Minutes by ID.
 */
export async function deleteQualityMeetingMinutes(db: any, id: string) {
  await db.delete(qualityMeetingMinutes).where(eq(qualityMeetingMinutes.id, id));
  return { deleted: true, id };
}
