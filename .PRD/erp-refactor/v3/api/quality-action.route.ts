// CRUD API handlers for Quality Action
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { qualityAction } from '../db/schema.js';
import { QualityActionSchema, QualityActionInsertSchema } from '../types/quality-action.js';

export const ROUTE_PREFIX = '/quality-action';

/**
 * List Quality Action records.
 */
export async function listQualityAction(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(qualityAction).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Quality Action by ID.
 */
export async function getQualityAction(db: any, id: string) {
  const rows = await db.select().from(qualityAction).where(eq(qualityAction.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Quality Action.
 */
export async function createQualityAction(db: any, data: unknown) {
  const parsed = QualityActionInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(qualityAction).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Quality Action.
 */
export async function updateQualityAction(db: any, id: string, data: unknown) {
  const parsed = QualityActionInsertSchema.partial().parse(data);
  await db.update(qualityAction).set({ ...parsed, modified: new Date() }).where(eq(qualityAction.id, id));
  return getQualityAction(db, id);
}

/**
 * Delete a Quality Action by ID.
 */
export async function deleteQualityAction(db: any, id: string) {
  await db.delete(qualityAction).where(eq(qualityAction.id, id));
  return { deleted: true, id };
}
