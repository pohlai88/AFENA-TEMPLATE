// CRUD API handlers for Opportunity Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { opportunityItem } from '../db/schema.js';
import { OpportunityItemSchema, OpportunityItemInsertSchema } from '../types/opportunity-item.js';

export const ROUTE_PREFIX = '/opportunity-item';

/**
 * List Opportunity Item records.
 */
export async function listOpportunityItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(opportunityItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Opportunity Item by ID.
 */
export async function getOpportunityItem(db: any, id: string) {
  const rows = await db.select().from(opportunityItem).where(eq(opportunityItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Opportunity Item.
 */
export async function createOpportunityItem(db: any, data: unknown) {
  const parsed = OpportunityItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(opportunityItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Opportunity Item.
 */
export async function updateOpportunityItem(db: any, id: string, data: unknown) {
  const parsed = OpportunityItemInsertSchema.partial().parse(data);
  await db.update(opportunityItem).set({ ...parsed, modified: new Date() }).where(eq(opportunityItem.id, id));
  return getOpportunityItem(db, id);
}

/**
 * Delete a Opportunity Item by ID.
 */
export async function deleteOpportunityItem(db: any, id: string) {
  await db.delete(opportunityItem).where(eq(opportunityItem.id, id));
  return { deleted: true, id };
}
