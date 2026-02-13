// CRUD API handlers for SLA Fulfilled On Status
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { slaFulfilledOnStatus } from '../db/schema.js';
import { SlaFulfilledOnStatusSchema, SlaFulfilledOnStatusInsertSchema } from '../types/sla-fulfilled-on-status.js';

export const ROUTE_PREFIX = '/sla-fulfilled-on-status';

/**
 * List SLA Fulfilled On Status records.
 */
export async function listSlaFulfilledOnStatus(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(slaFulfilledOnStatus).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single SLA Fulfilled On Status by ID.
 */
export async function getSlaFulfilledOnStatus(db: any, id: string) {
  const rows = await db.select().from(slaFulfilledOnStatus).where(eq(slaFulfilledOnStatus.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new SLA Fulfilled On Status.
 */
export async function createSlaFulfilledOnStatus(db: any, data: unknown) {
  const parsed = SlaFulfilledOnStatusInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(slaFulfilledOnStatus).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing SLA Fulfilled On Status.
 */
export async function updateSlaFulfilledOnStatus(db: any, id: string, data: unknown) {
  const parsed = SlaFulfilledOnStatusInsertSchema.partial().parse(data);
  await db.update(slaFulfilledOnStatus).set({ ...parsed, modified: new Date() }).where(eq(slaFulfilledOnStatus.id, id));
  return getSlaFulfilledOnStatus(db, id);
}

/**
 * Delete a SLA Fulfilled On Status by ID.
 */
export async function deleteSlaFulfilledOnStatus(db: any, id: string) {
  await db.delete(slaFulfilledOnStatus).where(eq(slaFulfilledOnStatus.id, id));
  return { deleted: true, id };
}
