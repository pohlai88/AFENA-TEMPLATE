// CRUD API handlers for Pause SLA On Status
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { pauseSlaOnStatus } from '../db/schema.js';
import { PauseSlaOnStatusSchema, PauseSlaOnStatusInsertSchema } from '../types/pause-sla-on-status.js';

export const ROUTE_PREFIX = '/pause-sla-on-status';

/**
 * List Pause SLA On Status records.
 */
export async function listPauseSlaOnStatus(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(pauseSlaOnStatus).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Pause SLA On Status by ID.
 */
export async function getPauseSlaOnStatus(db: any, id: string) {
  const rows = await db.select().from(pauseSlaOnStatus).where(eq(pauseSlaOnStatus.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Pause SLA On Status.
 */
export async function createPauseSlaOnStatus(db: any, data: unknown) {
  const parsed = PauseSlaOnStatusInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(pauseSlaOnStatus).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Pause SLA On Status.
 */
export async function updatePauseSlaOnStatus(db: any, id: string, data: unknown) {
  const parsed = PauseSlaOnStatusInsertSchema.partial().parse(data);
  await db.update(pauseSlaOnStatus).set({ ...parsed, modified: new Date() }).where(eq(pauseSlaOnStatus.id, id));
  return getPauseSlaOnStatus(db, id);
}

/**
 * Delete a Pause SLA On Status by ID.
 */
export async function deletePauseSlaOnStatus(db: any, id: string) {
  await db.delete(pauseSlaOnStatus).where(eq(pauseSlaOnStatus.id, id));
  return { deleted: true, id };
}
