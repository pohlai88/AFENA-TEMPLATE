// CRUD API handlers for Loyalty Program
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { loyaltyProgram } from '../db/schema.js';
import { LoyaltyProgramSchema, LoyaltyProgramInsertSchema } from '../types/loyalty-program.js';

export const ROUTE_PREFIX = '/loyalty-program';

/**
 * List Loyalty Program records.
 */
export async function listLoyaltyProgram(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(loyaltyProgram).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Loyalty Program by ID.
 */
export async function getLoyaltyProgram(db: any, id: string) {
  const rows = await db.select().from(loyaltyProgram).where(eq(loyaltyProgram.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Loyalty Program.
 */
export async function createLoyaltyProgram(db: any, data: unknown) {
  const parsed = LoyaltyProgramInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(loyaltyProgram).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Loyalty Program.
 */
export async function updateLoyaltyProgram(db: any, id: string, data: unknown) {
  const parsed = LoyaltyProgramInsertSchema.partial().parse(data);
  await db.update(loyaltyProgram).set({ ...parsed, modified: new Date() }).where(eq(loyaltyProgram.id, id));
  return getLoyaltyProgram(db, id);
}

/**
 * Delete a Loyalty Program by ID.
 */
export async function deleteLoyaltyProgram(db: any, id: string) {
  await db.delete(loyaltyProgram).where(eq(loyaltyProgram.id, id));
  return { deleted: true, id };
}
