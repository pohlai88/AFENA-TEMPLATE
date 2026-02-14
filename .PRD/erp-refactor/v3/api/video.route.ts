// CRUD API handlers for Video
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { video } from '../db/schema.js';
import { VideoSchema, VideoInsertSchema } from '../types/video.js';

export const ROUTE_PREFIX = '/video';

/**
 * List Video records.
 */
export async function listVideo(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(video).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Video by ID.
 */
export async function getVideo(db: any, id: string) {
  const rows = await db.select().from(video).where(eq(video.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Video.
 */
export async function createVideo(db: any, data: unknown) {
  const parsed = VideoInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(video).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Video.
 */
export async function updateVideo(db: any, id: string, data: unknown) {
  const parsed = VideoInsertSchema.partial().parse(data);
  await db.update(video).set({ ...parsed, modified: new Date() }).where(eq(video.id, id));
  return getVideo(db, id);
}

/**
 * Delete a Video by ID.
 */
export async function deleteVideo(db: any, id: string) {
  await db.delete(video).where(eq(video.id, id));
  return { deleted: true, id };
}
