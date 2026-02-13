// CRUD API handlers for Voice Call Settings
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { voiceCallSettings } from '../db/schema.js';
import { VoiceCallSettingsSchema, VoiceCallSettingsInsertSchema } from '../types/voice-call-settings.js';

export const ROUTE_PREFIX = '/voice-call-settings';

/**
 * List Voice Call Settings records.
 */
export async function listVoiceCallSettings(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(voiceCallSettings).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Voice Call Settings by ID.
 */
export async function getVoiceCallSettings(db: any, id: string) {
  const rows = await db.select().from(voiceCallSettings).where(eq(voiceCallSettings.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Voice Call Settings.
 */
export async function createVoiceCallSettings(db: any, data: unknown) {
  const parsed = VoiceCallSettingsInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(voiceCallSettings).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Voice Call Settings.
 */
export async function updateVoiceCallSettings(db: any, id: string, data: unknown) {
  const parsed = VoiceCallSettingsInsertSchema.partial().parse(data);
  await db.update(voiceCallSettings).set({ ...parsed, modified: new Date() }).where(eq(voiceCallSettings.id, id));
  return getVoiceCallSettings(db, id);
}

/**
 * Delete a Voice Call Settings by ID.
 */
export async function deleteVoiceCallSettings(db: any, id: string) {
  await db.delete(voiceCallSettings).where(eq(voiceCallSettings.id, id));
  return { deleted: true, id };
}
