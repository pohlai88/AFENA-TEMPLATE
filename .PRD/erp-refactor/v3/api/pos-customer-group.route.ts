// CRUD API handlers for POS Customer Group
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { posCustomerGroup } from '../db/schema.js';
import { PosCustomerGroupSchema, PosCustomerGroupInsertSchema } from '../types/pos-customer-group.js';

export const ROUTE_PREFIX = '/pos-customer-group';

/**
 * List POS Customer Group records.
 */
export async function listPosCustomerGroup(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(posCustomerGroup).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single POS Customer Group by ID.
 */
export async function getPosCustomerGroup(db: any, id: string) {
  const rows = await db.select().from(posCustomerGroup).where(eq(posCustomerGroup.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new POS Customer Group.
 */
export async function createPosCustomerGroup(db: any, data: unknown) {
  const parsed = PosCustomerGroupInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(posCustomerGroup).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing POS Customer Group.
 */
export async function updatePosCustomerGroup(db: any, id: string, data: unknown) {
  const parsed = PosCustomerGroupInsertSchema.partial().parse(data);
  await db.update(posCustomerGroup).set({ ...parsed, modified: new Date() }).where(eq(posCustomerGroup.id, id));
  return getPosCustomerGroup(db, id);
}

/**
 * Delete a POS Customer Group by ID.
 */
export async function deletePosCustomerGroup(db: any, id: string) {
  await db.delete(posCustomerGroup).where(eq(posCustomerGroup.id, id));
  return { deleted: true, id };
}
