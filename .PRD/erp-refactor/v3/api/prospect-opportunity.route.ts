// CRUD API handlers for Prospect Opportunity
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { prospectOpportunity } from '../db/schema.js';
import { ProspectOpportunitySchema, ProspectOpportunityInsertSchema } from '../types/prospect-opportunity.js';

export const ROUTE_PREFIX = '/prospect-opportunity';

/**
 * List Prospect Opportunity records.
 */
export async function listProspectOpportunity(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(prospectOpportunity).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Prospect Opportunity by ID.
 */
export async function getProspectOpportunity(db: any, id: string) {
  const rows = await db.select().from(prospectOpportunity).where(eq(prospectOpportunity.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Prospect Opportunity.
 */
export async function createProspectOpportunity(db: any, data: unknown) {
  const parsed = ProspectOpportunityInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(prospectOpportunity).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Prospect Opportunity.
 */
export async function updateProspectOpportunity(db: any, id: string, data: unknown) {
  const parsed = ProspectOpportunityInsertSchema.partial().parse(data);
  await db.update(prospectOpportunity).set({ ...parsed, modified: new Date() }).where(eq(prospectOpportunity.id, id));
  return getProspectOpportunity(db, id);
}

/**
 * Delete a Prospect Opportunity by ID.
 */
export async function deleteProspectOpportunity(db: any, id: string) {
  await db.delete(prospectOpportunity).where(eq(prospectOpportunity.id, id));
  return { deleted: true, id };
}
