// CRUD API handlers for Quality Action Resolution
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { qualityActionResolution } from '../db/schema.js';
import { QualityActionResolutionSchema, QualityActionResolutionInsertSchema } from '../types/quality-action-resolution.js';

export const ROUTE_PREFIX = '/quality-action-resolution';

/**
 * List Quality Action Resolution records.
 */
export async function listQualityActionResolution(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(qualityActionResolution).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Quality Action Resolution by ID.
 */
export async function getQualityActionResolution(db: any, id: string) {
  const rows = await db.select().from(qualityActionResolution).where(eq(qualityActionResolution.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Quality Action Resolution.
 */
export async function createQualityActionResolution(db: any, data: unknown) {
  const parsed = QualityActionResolutionInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(qualityActionResolution).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Quality Action Resolution.
 */
export async function updateQualityActionResolution(db: any, id: string, data: unknown) {
  const parsed = QualityActionResolutionInsertSchema.partial().parse(data);
  await db.update(qualityActionResolution).set({ ...parsed, modified: new Date() }).where(eq(qualityActionResolution.id, id));
  return getQualityActionResolution(db, id);
}

/**
 * Delete a Quality Action Resolution by ID.
 */
export async function deleteQualityActionResolution(db: any, id: string) {
  await db.delete(qualityActionResolution).where(eq(qualityActionResolution.id, id));
  return { deleted: true, id };
}
