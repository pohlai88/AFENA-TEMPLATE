// CRUD API handlers for Opportunity Lost Reason Detail
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { opportunityLostReasonDetail } from '../db/schema.js';
import { OpportunityLostReasonDetailSchema, OpportunityLostReasonDetailInsertSchema } from '../types/opportunity-lost-reason-detail.js';

export const ROUTE_PREFIX = '/opportunity-lost-reason-detail';

/**
 * List Opportunity Lost Reason Detail records.
 */
export async function listOpportunityLostReasonDetail(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(opportunityLostReasonDetail).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Opportunity Lost Reason Detail by ID.
 */
export async function getOpportunityLostReasonDetail(db: any, id: string) {
  const rows = await db.select().from(opportunityLostReasonDetail).where(eq(opportunityLostReasonDetail.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Opportunity Lost Reason Detail.
 */
export async function createOpportunityLostReasonDetail(db: any, data: unknown) {
  const parsed = OpportunityLostReasonDetailInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(opportunityLostReasonDetail).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Opportunity Lost Reason Detail.
 */
export async function updateOpportunityLostReasonDetail(db: any, id: string, data: unknown) {
  const parsed = OpportunityLostReasonDetailInsertSchema.partial().parse(data);
  await db.update(opportunityLostReasonDetail).set({ ...parsed, modified: new Date() }).where(eq(opportunityLostReasonDetail.id, id));
  return getOpportunityLostReasonDetail(db, id);
}

/**
 * Delete a Opportunity Lost Reason Detail by ID.
 */
export async function deleteOpportunityLostReasonDetail(db: any, id: string) {
  await db.delete(opportunityLostReasonDetail).where(eq(opportunityLostReasonDetail.id, id));
  return { deleted: true, id };
}
