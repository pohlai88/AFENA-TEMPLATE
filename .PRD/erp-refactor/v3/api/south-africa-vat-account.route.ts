// CRUD API handlers for South Africa VAT Account
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { southAfricaVatAccount } from '../db/schema.js';
import { SouthAfricaVatAccountSchema, SouthAfricaVatAccountInsertSchema } from '../types/south-africa-vat-account.js';

export const ROUTE_PREFIX = '/south-africa-vat-account';

/**
 * List South Africa VAT Account records.
 */
export async function listSouthAfricaVatAccount(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(southAfricaVatAccount).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single South Africa VAT Account by ID.
 */
export async function getSouthAfricaVatAccount(db: any, id: string) {
  const rows = await db.select().from(southAfricaVatAccount).where(eq(southAfricaVatAccount.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new South Africa VAT Account.
 */
export async function createSouthAfricaVatAccount(db: any, data: unknown) {
  const parsed = SouthAfricaVatAccountInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(southAfricaVatAccount).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing South Africa VAT Account.
 */
export async function updateSouthAfricaVatAccount(db: any, id: string, data: unknown) {
  const parsed = SouthAfricaVatAccountInsertSchema.partial().parse(data);
  await db.update(southAfricaVatAccount).set({ ...parsed, modified: new Date() }).where(eq(southAfricaVatAccount.id, id));
  return getSouthAfricaVatAccount(db, id);
}

/**
 * Delete a South Africa VAT Account by ID.
 */
export async function deleteSouthAfricaVatAccount(db: any, id: string) {
  await db.delete(southAfricaVatAccount).where(eq(southAfricaVatAccount.id, id));
  return { deleted: true, id };
}
