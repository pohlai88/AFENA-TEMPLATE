// CRUD API handlers for Opportunity Lost Reason
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { opportunityLostReason } from '../db/schema.js';
import { OpportunityLostReasonSchema, OpportunityLostReasonInsertSchema } from '../types/opportunity-lost-reason.js';

export const ROUTE_PREFIX = '/opportunity-lost-reason';

/**
 * List Opportunity Lost Reason records.
 */
export async function listOpportunityLostReason(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(opportunityLostReason).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Opportunity Lost Reason by ID.
 */
export async function getOpportunityLostReason(db: any, id: string) {
  const rows = await db.select().from(opportunityLostReason).where(eq(opportunityLostReason.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Opportunity Lost Reason.
 */
export async function createOpportunityLostReason(db: any, data: unknown) {
  const parsed = OpportunityLostReasonInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(opportunityLostReason).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Opportunity Lost Reason.
 */
export async function updateOpportunityLostReason(db: any, id: string, data: unknown) {
  const parsed = OpportunityLostReasonInsertSchema.partial().parse(data);
  await db.update(opportunityLostReason).set({ ...parsed, modified: new Date() }).where(eq(opportunityLostReason.id, id));
  return getOpportunityLostReason(db, id);
}

/**
 * Delete a Opportunity Lost Reason by ID.
 */
export async function deleteOpportunityLostReason(db: any, id: string) {
  await db.delete(opportunityLostReason).where(eq(opportunityLostReason.id, id));
  return { deleted: true, id };
}
