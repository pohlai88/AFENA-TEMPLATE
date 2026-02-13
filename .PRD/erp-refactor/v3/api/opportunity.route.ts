// CRUD API handlers for Opportunity
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { opportunity } from '../db/schema.js';
import { OpportunitySchema, OpportunityInsertSchema } from '../types/opportunity.js';

export const ROUTE_PREFIX = '/opportunity';

/**
 * List Opportunity records.
 */
export async function listOpportunity(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(opportunity).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Opportunity by ID.
 */
export async function getOpportunity(db: any, id: string) {
  const rows = await db.select().from(opportunity).where(eq(opportunity.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Opportunity.
 */
export async function createOpportunity(db: any, data: unknown) {
  const parsed = OpportunityInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(opportunity).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Opportunity.
 */
export async function updateOpportunity(db: any, id: string, data: unknown) {
  const parsed = OpportunityInsertSchema.partial().parse(data);
  await db.update(opportunity).set({ ...parsed, modified: new Date() }).where(eq(opportunity.id, id));
  return getOpportunity(db, id);
}

/**
 * Delete a Opportunity by ID.
 */
export async function deleteOpportunity(db: any, id: string) {
  await db.delete(opportunity).where(eq(opportunity.id, id));
  return { deleted: true, id };
}
