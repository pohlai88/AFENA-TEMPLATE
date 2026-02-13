// CRUD API handlers for Authorization Rule
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { authorizationRule } from '../db/schema.js';
import { AuthorizationRuleSchema, AuthorizationRuleInsertSchema } from '../types/authorization-rule.js';

export const ROUTE_PREFIX = '/authorization-rule';

/**
 * List Authorization Rule records.
 */
export async function listAuthorizationRule(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(authorizationRule).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Authorization Rule by ID.
 */
export async function getAuthorizationRule(db: any, id: string) {
  const rows = await db.select().from(authorizationRule).where(eq(authorizationRule.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Authorization Rule.
 */
export async function createAuthorizationRule(db: any, data: unknown) {
  const parsed = AuthorizationRuleInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(authorizationRule).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Authorization Rule.
 */
export async function updateAuthorizationRule(db: any, id: string, data: unknown) {
  const parsed = AuthorizationRuleInsertSchema.partial().parse(data);
  await db.update(authorizationRule).set({ ...parsed, modified: new Date() }).where(eq(authorizationRule.id, id));
  return getAuthorizationRule(db, id);
}

/**
 * Delete a Authorization Rule by ID.
 */
export async function deleteAuthorizationRule(db: any, id: string) {
  await db.delete(authorizationRule).where(eq(authorizationRule.id, id));
  return { deleted: true, id };
}
