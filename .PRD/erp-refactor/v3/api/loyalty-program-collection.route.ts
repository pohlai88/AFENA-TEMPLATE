// CRUD API handlers for Loyalty Program Collection
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { loyaltyProgramCollection } from '../db/schema.js';
import { LoyaltyProgramCollectionSchema, LoyaltyProgramCollectionInsertSchema } from '../types/loyalty-program-collection.js';

export const ROUTE_PREFIX = '/loyalty-program-collection';

/**
 * List Loyalty Program Collection records.
 */
export async function listLoyaltyProgramCollection(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(loyaltyProgramCollection).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Loyalty Program Collection by ID.
 */
export async function getLoyaltyProgramCollection(db: any, id: string) {
  const rows = await db.select().from(loyaltyProgramCollection).where(eq(loyaltyProgramCollection.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Loyalty Program Collection.
 */
export async function createLoyaltyProgramCollection(db: any, data: unknown) {
  const parsed = LoyaltyProgramCollectionInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(loyaltyProgramCollection).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Loyalty Program Collection.
 */
export async function updateLoyaltyProgramCollection(db: any, id: string, data: unknown) {
  const parsed = LoyaltyProgramCollectionInsertSchema.partial().parse(data);
  await db.update(loyaltyProgramCollection).set({ ...parsed, modified: new Date() }).where(eq(loyaltyProgramCollection.id, id));
  return getLoyaltyProgramCollection(db, id);
}

/**
 * Delete a Loyalty Program Collection by ID.
 */
export async function deleteLoyaltyProgramCollection(db: any, id: string) {
  await db.delete(loyaltyProgramCollection).where(eq(loyaltyProgramCollection.id, id));
  return { deleted: true, id };
}
