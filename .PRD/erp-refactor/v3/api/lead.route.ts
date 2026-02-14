// CRUD API handlers for Lead
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { lead } from '../db/schema.js';
import { LeadSchema, LeadInsertSchema } from '../types/lead.js';

export const ROUTE_PREFIX = '/lead';

/**
 * List Lead records.
 */
export async function listLead(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(lead).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Lead by ID.
 */
export async function getLead(db: any, id: string) {
  const rows = await db.select().from(lead).where(eq(lead.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Lead.
 */
export async function createLead(db: any, data: unknown) {
  const parsed = LeadInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(lead).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Lead.
 */
export async function updateLead(db: any, id: string, data: unknown) {
  const parsed = LeadInsertSchema.partial().parse(data);
  await db.update(lead).set({ ...parsed, modified: new Date() }).where(eq(lead.id, id));
  return getLead(db, id);
}

/**
 * Delete a Lead by ID.
 */
export async function deleteLead(db: any, id: string) {
  await db.delete(lead).where(eq(lead.id, id));
  return { deleted: true, id };
}
