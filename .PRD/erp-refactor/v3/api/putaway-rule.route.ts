// CRUD API handlers for Putaway Rule
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { putawayRule } from '../db/schema.js';
import { PutawayRuleSchema, PutawayRuleInsertSchema } from '../types/putaway-rule.js';

export const ROUTE_PREFIX = '/putaway-rule';

/**
 * List Putaway Rule records.
 */
export async function listPutawayRule(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(putawayRule).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Putaway Rule by ID.
 */
export async function getPutawayRule(db: any, id: string) {
  const rows = await db.select().from(putawayRule).where(eq(putawayRule.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Putaway Rule.
 */
export async function createPutawayRule(db: any, data: unknown) {
  const parsed = PutawayRuleInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(putawayRule).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Putaway Rule.
 */
export async function updatePutawayRule(db: any, id: string, data: unknown) {
  const parsed = PutawayRuleInsertSchema.partial().parse(data);
  await db.update(putawayRule).set({ ...parsed, modified: new Date() }).where(eq(putawayRule.id, id));
  return getPutawayRule(db, id);
}

/**
 * Delete a Putaway Rule by ID.
 */
export async function deletePutawayRule(db: any, id: string) {
  await db.delete(putawayRule).where(eq(putawayRule.id, id));
  return { deleted: true, id };
}
