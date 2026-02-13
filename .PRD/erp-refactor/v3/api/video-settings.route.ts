// CRUD API handlers for Video Settings
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { videoSettings } from '../db/schema.js';
import { VideoSettingsSchema, VideoSettingsInsertSchema } from '../types/video-settings.js';

export const ROUTE_PREFIX = '/video-settings';

/**
 * List Video Settings records.
 */
export async function listVideoSettings(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(videoSettings).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Video Settings by ID.
 */
export async function getVideoSettings(db: any, id: string) {
  const rows = await db.select().from(videoSettings).where(eq(videoSettings.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Video Settings.
 */
export async function createVideoSettings(db: any, data: unknown) {
  const parsed = VideoSettingsInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(videoSettings).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Video Settings.
 */
export async function updateVideoSettings(db: any, id: string, data: unknown) {
  const parsed = VideoSettingsInsertSchema.partial().parse(data);
  await db.update(videoSettings).set({ ...parsed, modified: new Date() }).where(eq(videoSettings.id, id));
  return getVideoSettings(db, id);
}

/**
 * Delete a Video Settings by ID.
 */
export async function deleteVideoSettings(db: any, id: string) {
  await db.delete(videoSettings).where(eq(videoSettings.id, id));
  return { deleted: true, id };
}
