// CRUD API handlers for Loyalty Point Entry
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { loyaltyPointEntry } from '../db/schema.js';
import { LoyaltyPointEntrySchema, LoyaltyPointEntryInsertSchema } from '../types/loyalty-point-entry.js';

export const ROUTE_PREFIX = '/loyalty-point-entry';

/**
 * List Loyalty Point Entry records.
 */
export async function listLoyaltyPointEntry(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(loyaltyPointEntry).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Loyalty Point Entry by ID.
 */
export async function getLoyaltyPointEntry(db: any, id: string) {
  const rows = await db.select().from(loyaltyPointEntry).where(eq(loyaltyPointEntry.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Loyalty Point Entry.
 */
export async function createLoyaltyPointEntry(db: any, data: unknown) {
  const parsed = LoyaltyPointEntryInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(loyaltyPointEntry).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Loyalty Point Entry.
 */
export async function updateLoyaltyPointEntry(db: any, id: string, data: unknown) {
  const parsed = LoyaltyPointEntryInsertSchema.partial().parse(data);
  await db.update(loyaltyPointEntry).set({ ...parsed, modified: new Date() }).where(eq(loyaltyPointEntry.id, id));
  return getLoyaltyPointEntry(db, id);
}

/**
 * Delete a Loyalty Point Entry by ID.
 */
export async function deleteLoyaltyPointEntry(db: any, id: string) {
  await db.delete(loyaltyPointEntry).where(eq(loyaltyPointEntry.id, id));
  return { deleted: true, id };
}
