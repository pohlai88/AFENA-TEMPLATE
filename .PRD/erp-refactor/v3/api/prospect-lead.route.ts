// CRUD API handlers for Prospect Lead
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { prospectLead } from '../db/schema.js';
import { ProspectLeadSchema, ProspectLeadInsertSchema } from '../types/prospect-lead.js';

export const ROUTE_PREFIX = '/prospect-lead';

/**
 * List Prospect Lead records.
 */
export async function listProspectLead(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(prospectLead).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Prospect Lead by ID.
 */
export async function getProspectLead(db: any, id: string) {
  const rows = await db.select().from(prospectLead).where(eq(prospectLead.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Prospect Lead.
 */
export async function createProspectLead(db: any, data: unknown) {
  const parsed = ProspectLeadInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(prospectLead).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Prospect Lead.
 */
export async function updateProspectLead(db: any, id: string, data: unknown) {
  const parsed = ProspectLeadInsertSchema.partial().parse(data);
  await db.update(prospectLead).set({ ...parsed, modified: new Date() }).where(eq(prospectLead.id, id));
  return getProspectLead(db, id);
}

/**
 * Delete a Prospect Lead by ID.
 */
export async function deleteProspectLead(db: any, id: string) {
  await db.delete(prospectLead).where(eq(prospectLead.id, id));
  return { deleted: true, id };
}
