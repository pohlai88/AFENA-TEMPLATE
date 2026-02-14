// CRUD API handlers for Applicable On Account
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { applicableOnAccount } from '../db/schema.js';
import { ApplicableOnAccountSchema, ApplicableOnAccountInsertSchema } from '../types/applicable-on-account.js';

export const ROUTE_PREFIX = '/applicable-on-account';

/**
 * List Applicable On Account records.
 */
export async function listApplicableOnAccount(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(applicableOnAccount).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Applicable On Account by ID.
 */
export async function getApplicableOnAccount(db: any, id: string) {
  const rows = await db.select().from(applicableOnAccount).where(eq(applicableOnAccount.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Applicable On Account.
 */
export async function createApplicableOnAccount(db: any, data: unknown) {
  const parsed = ApplicableOnAccountInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(applicableOnAccount).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Applicable On Account.
 */
export async function updateApplicableOnAccount(db: any, id: string, data: unknown) {
  const parsed = ApplicableOnAccountInsertSchema.partial().parse(data);
  await db.update(applicableOnAccount).set({ ...parsed, modified: new Date() }).where(eq(applicableOnAccount.id, id));
  return getApplicableOnAccount(db, id);
}

/**
 * Delete a Applicable On Account by ID.
 */
export async function deleteApplicableOnAccount(db: any, id: string) {
  await db.delete(applicableOnAccount).where(eq(applicableOnAccount.id, id));
  return { deleted: true, id };
}
