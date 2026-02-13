// CRUD API handlers for Loyalty Point Entry Redemption
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { loyaltyPointEntryRedemption } from '../db/schema.js';
import { LoyaltyPointEntryRedemptionSchema, LoyaltyPointEntryRedemptionInsertSchema } from '../types/loyalty-point-entry-redemption.js';

export const ROUTE_PREFIX = '/loyalty-point-entry-redemption';

/**
 * List Loyalty Point Entry Redemption records.
 */
export async function listLoyaltyPointEntryRedemption(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(loyaltyPointEntryRedemption).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Loyalty Point Entry Redemption by ID.
 */
export async function getLoyaltyPointEntryRedemption(db: any, id: string) {
  const rows = await db.select().from(loyaltyPointEntryRedemption).where(eq(loyaltyPointEntryRedemption.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Loyalty Point Entry Redemption.
 */
export async function createLoyaltyPointEntryRedemption(db: any, data: unknown) {
  const parsed = LoyaltyPointEntryRedemptionInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(loyaltyPointEntryRedemption).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Loyalty Point Entry Redemption.
 */
export async function updateLoyaltyPointEntryRedemption(db: any, id: string, data: unknown) {
  const parsed = LoyaltyPointEntryRedemptionInsertSchema.partial().parse(data);
  await db.update(loyaltyPointEntryRedemption).set({ ...parsed, modified: new Date() }).where(eq(loyaltyPointEntryRedemption.id, id));
  return getLoyaltyPointEntryRedemption(db, id);
}

/**
 * Delete a Loyalty Point Entry Redemption by ID.
 */
export async function deleteLoyaltyPointEntryRedemption(db: any, id: string) {
  await db.delete(loyaltyPointEntryRedemption).where(eq(loyaltyPointEntryRedemption.id, id));
  return { deleted: true, id };
}
