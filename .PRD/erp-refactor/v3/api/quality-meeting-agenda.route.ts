// CRUD API handlers for Quality Meeting Agenda
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { qualityMeetingAgenda } from '../db/schema.js';
import { QualityMeetingAgendaSchema, QualityMeetingAgendaInsertSchema } from '../types/quality-meeting-agenda.js';

export const ROUTE_PREFIX = '/quality-meeting-agenda';

/**
 * List Quality Meeting Agenda records.
 */
export async function listQualityMeetingAgenda(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(qualityMeetingAgenda).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Quality Meeting Agenda by ID.
 */
export async function getQualityMeetingAgenda(db: any, id: string) {
  const rows = await db.select().from(qualityMeetingAgenda).where(eq(qualityMeetingAgenda.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Quality Meeting Agenda.
 */
export async function createQualityMeetingAgenda(db: any, data: unknown) {
  const parsed = QualityMeetingAgendaInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(qualityMeetingAgenda).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Quality Meeting Agenda.
 */
export async function updateQualityMeetingAgenda(db: any, id: string, data: unknown) {
  const parsed = QualityMeetingAgendaInsertSchema.partial().parse(data);
  await db.update(qualityMeetingAgenda).set({ ...parsed, modified: new Date() }).where(eq(qualityMeetingAgenda.id, id));
  return getQualityMeetingAgenda(db, id);
}

/**
 * Delete a Quality Meeting Agenda by ID.
 */
export async function deleteQualityMeetingAgenda(db: any, id: string) {
  await db.delete(qualityMeetingAgenda).where(eq(qualityMeetingAgenda.id, id));
  return { deleted: true, id };
}
