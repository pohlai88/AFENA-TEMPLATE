// CRUD API handlers for UAE VAT Account
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { uaeVatAccount } from '../db/schema.js';
import { UaeVatAccountSchema, UaeVatAccountInsertSchema } from '../types/uae-vat-account.js';

export const ROUTE_PREFIX = '/uae-vat-account';

/**
 * List UAE VAT Account records.
 */
export async function listUaeVatAccount(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(uaeVatAccount).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single UAE VAT Account by ID.
 */
export async function getUaeVatAccount(db: any, id: string) {
  const rows = await db.select().from(uaeVatAccount).where(eq(uaeVatAccount.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new UAE VAT Account.
 */
export async function createUaeVatAccount(db: any, data: unknown) {
  const parsed = UaeVatAccountInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(uaeVatAccount).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing UAE VAT Account.
 */
export async function updateUaeVatAccount(db: any, id: string, data: unknown) {
  const parsed = UaeVatAccountInsertSchema.partial().parse(data);
  await db.update(uaeVatAccount).set({ ...parsed, modified: new Date() }).where(eq(uaeVatAccount.id, id));
  return getUaeVatAccount(db, id);
}

/**
 * Delete a UAE VAT Account by ID.
 */
export async function deleteUaeVatAccount(db: any, id: string) {
  await db.delete(uaeVatAccount).where(eq(uaeVatAccount.id, id));
  return { deleted: true, id };
}
