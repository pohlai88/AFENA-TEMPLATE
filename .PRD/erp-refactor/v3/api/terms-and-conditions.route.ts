// CRUD API handlers for Terms and Conditions
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { termsAndConditions } from '../db/schema.js';
import { TermsAndConditionsSchema, TermsAndConditionsInsertSchema } from '../types/terms-and-conditions.js';

export const ROUTE_PREFIX = '/terms-and-conditions';

/**
 * List Terms and Conditions records.
 */
export async function listTermsAndConditions(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(termsAndConditions).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Terms and Conditions by ID.
 */
export async function getTermsAndConditions(db: any, id: string) {
  const rows = await db.select().from(termsAndConditions).where(eq(termsAndConditions.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Terms and Conditions.
 */
export async function createTermsAndConditions(db: any, data: unknown) {
  const parsed = TermsAndConditionsInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(termsAndConditions).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Terms and Conditions.
 */
export async function updateTermsAndConditions(db: any, id: string, data: unknown) {
  const parsed = TermsAndConditionsInsertSchema.partial().parse(data);
  await db.update(termsAndConditions).set({ ...parsed, modified: new Date() }).where(eq(termsAndConditions.id, id));
  return getTermsAndConditions(db, id);
}

/**
 * Delete a Terms and Conditions by ID.
 */
export async function deleteTermsAndConditions(db: any, id: string) {
  await db.delete(termsAndConditions).where(eq(termsAndConditions.id, id));
  return { deleted: true, id };
}
