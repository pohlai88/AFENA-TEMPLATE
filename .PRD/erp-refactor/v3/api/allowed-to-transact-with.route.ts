// CRUD API handlers for Allowed To Transact With
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { allowedToTransactWith } from '../db/schema.js';
import { AllowedToTransactWithSchema, AllowedToTransactWithInsertSchema } from '../types/allowed-to-transact-with.js';

export const ROUTE_PREFIX = '/allowed-to-transact-with';

/**
 * List Allowed To Transact With records.
 */
export async function listAllowedToTransactWith(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(allowedToTransactWith).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Allowed To Transact With by ID.
 */
export async function getAllowedToTransactWith(db: any, id: string) {
  const rows = await db.select().from(allowedToTransactWith).where(eq(allowedToTransactWith.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Allowed To Transact With.
 */
export async function createAllowedToTransactWith(db: any, data: unknown) {
  const parsed = AllowedToTransactWithInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(allowedToTransactWith).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Allowed To Transact With.
 */
export async function updateAllowedToTransactWith(db: any, id: string, data: unknown) {
  const parsed = AllowedToTransactWithInsertSchema.partial().parse(data);
  await db.update(allowedToTransactWith).set({ ...parsed, modified: new Date() }).where(eq(allowedToTransactWith.id, id));
  return getAllowedToTransactWith(db, id);
}

/**
 * Delete a Allowed To Transact With by ID.
 */
export async function deleteAllowedToTransactWith(db: any, id: string) {
  await db.delete(allowedToTransactWith).where(eq(allowedToTransactWith.id, id));
  return { deleted: true, id };
}
