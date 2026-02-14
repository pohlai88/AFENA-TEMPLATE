// CRUD API handlers for Opportunity Type
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { opportunityType } from '../db/schema.js';
import { OpportunityTypeSchema, OpportunityTypeInsertSchema } from '../types/opportunity-type.js';

export const ROUTE_PREFIX = '/opportunity-type';

/**
 * List Opportunity Type records.
 */
export async function listOpportunityType(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(opportunityType).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Opportunity Type by ID.
 */
export async function getOpportunityType(db: any, id: string) {
  const rows = await db.select().from(opportunityType).where(eq(opportunityType.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Opportunity Type.
 */
export async function createOpportunityType(db: any, data: unknown) {
  const parsed = OpportunityTypeInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(opportunityType).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Opportunity Type.
 */
export async function updateOpportunityType(db: any, id: string, data: unknown) {
  const parsed = OpportunityTypeInsertSchema.partial().parse(data);
  await db.update(opportunityType).set({ ...parsed, modified: new Date() }).where(eq(opportunityType.id, id));
  return getOpportunityType(db, id);
}

/**
 * Delete a Opportunity Type by ID.
 */
export async function deleteOpportunityType(db: any, id: string) {
  await db.delete(opportunityType).where(eq(opportunityType.id, id));
  return { deleted: true, id };
}
