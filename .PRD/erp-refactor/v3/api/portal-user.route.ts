// CRUD API handlers for Portal User
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { portalUser } from '../db/schema.js';
import { PortalUserSchema, PortalUserInsertSchema } from '../types/portal-user.js';

export const ROUTE_PREFIX = '/portal-user';

/**
 * List Portal User records.
 */
export async function listPortalUser(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(portalUser).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Portal User by ID.
 */
export async function getPortalUser(db: any, id: string) {
  const rows = await db.select().from(portalUser).where(eq(portalUser.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Portal User.
 */
export async function createPortalUser(db: any, data: unknown) {
  const parsed = PortalUserInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(portalUser).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Portal User.
 */
export async function updatePortalUser(db: any, id: string, data: unknown) {
  const parsed = PortalUserInsertSchema.partial().parse(data);
  await db.update(portalUser).set({ ...parsed, modified: new Date() }).where(eq(portalUser.id, id));
  return getPortalUser(db, id);
}

/**
 * Delete a Portal User by ID.
 */
export async function deletePortalUser(db: any, id: string) {
  await db.delete(portalUser).where(eq(portalUser.id, id));
  return { deleted: true, id };
}
