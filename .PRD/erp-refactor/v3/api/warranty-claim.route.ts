// CRUD API handlers for Warranty Claim
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { warrantyClaim } from '../db/schema.js';
import { WarrantyClaimSchema, WarrantyClaimInsertSchema } from '../types/warranty-claim.js';

export const ROUTE_PREFIX = '/warranty-claim';

/**
 * List Warranty Claim records.
 */
export async function listWarrantyClaim(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(warrantyClaim).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Warranty Claim by ID.
 */
export async function getWarrantyClaim(db: any, id: string) {
  const rows = await db.select().from(warrantyClaim).where(eq(warrantyClaim.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Warranty Claim.
 */
export async function createWarrantyClaim(db: any, data: unknown) {
  const parsed = WarrantyClaimInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(warrantyClaim).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Warranty Claim.
 */
export async function updateWarrantyClaim(db: any, id: string, data: unknown) {
  const parsed = WarrantyClaimInsertSchema.partial().parse(data);
  await db.update(warrantyClaim).set({ ...parsed, modified: new Date() }).where(eq(warrantyClaim.id, id));
  return getWarrantyClaim(db, id);
}

/**
 * Delete a Warranty Claim by ID.
 */
export async function deleteWarrantyClaim(db: any, id: string) {
  await db.delete(warrantyClaim).where(eq(warrantyClaim.id, id));
  return { deleted: true, id };
}
