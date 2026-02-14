// CRUD API handlers for Lost Reason Detail
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { lostReasonDetail } from '../db/schema.js';
import { LostReasonDetailSchema, LostReasonDetailInsertSchema } from '../types/lost-reason-detail.js';

export const ROUTE_PREFIX = '/lost-reason-detail';

/**
 * List Lost Reason Detail records.
 */
export async function listLostReasonDetail(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(lostReasonDetail).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Lost Reason Detail by ID.
 */
export async function getLostReasonDetail(db: any, id: string) {
  const rows = await db.select().from(lostReasonDetail).where(eq(lostReasonDetail.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Lost Reason Detail.
 */
export async function createLostReasonDetail(db: any, data: unknown) {
  const parsed = LostReasonDetailInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(lostReasonDetail).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Lost Reason Detail.
 */
export async function updateLostReasonDetail(db: any, id: string, data: unknown) {
  const parsed = LostReasonDetailInsertSchema.partial().parse(data);
  await db.update(lostReasonDetail).set({ ...parsed, modified: new Date() }).where(eq(lostReasonDetail.id, id));
  return getLostReasonDetail(db, id);
}

/**
 * Delete a Lost Reason Detail by ID.
 */
export async function deleteLostReasonDetail(db: any, id: string) {
  await db.delete(lostReasonDetail).where(eq(lostReasonDetail.id, id));
  return { deleted: true, id };
}
