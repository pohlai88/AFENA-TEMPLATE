// CRUD API handlers for Authorization Control
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { authorizationControl } from '../db/schema.js';
import { AuthorizationControlSchema, AuthorizationControlInsertSchema } from '../types/authorization-control.js';

export const ROUTE_PREFIX = '/authorization-control';

/**
 * List Authorization Control records.
 */
export async function listAuthorizationControl(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(authorizationControl).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Authorization Control by ID.
 */
export async function getAuthorizationControl(db: any, id: string) {
  const rows = await db.select().from(authorizationControl).where(eq(authorizationControl.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Authorization Control.
 */
export async function createAuthorizationControl(db: any, data: unknown) {
  const parsed = AuthorizationControlInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(authorizationControl).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Authorization Control.
 */
export async function updateAuthorizationControl(db: any, id: string, data: unknown) {
  const parsed = AuthorizationControlInsertSchema.partial().parse(data);
  await db.update(authorizationControl).set({ ...parsed, modified: new Date() }).where(eq(authorizationControl.id, id));
  return getAuthorizationControl(db, id);
}

/**
 * Delete a Authorization Control by ID.
 */
export async function deleteAuthorizationControl(db: any, id: string) {
  await db.delete(authorizationControl).where(eq(authorizationControl.id, id));
  return { deleted: true, id };
}
