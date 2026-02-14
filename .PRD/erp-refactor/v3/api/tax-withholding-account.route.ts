// CRUD API handlers for Tax Withholding Account
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { taxWithholdingAccount } from '../db/schema.js';
import { TaxWithholdingAccountSchema, TaxWithholdingAccountInsertSchema } from '../types/tax-withholding-account.js';

export const ROUTE_PREFIX = '/tax-withholding-account';

/**
 * List Tax Withholding Account records.
 */
export async function listTaxWithholdingAccount(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(taxWithholdingAccount).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Tax Withholding Account by ID.
 */
export async function getTaxWithholdingAccount(db: any, id: string) {
  const rows = await db.select().from(taxWithholdingAccount).where(eq(taxWithholdingAccount.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Tax Withholding Account.
 */
export async function createTaxWithholdingAccount(db: any, data: unknown) {
  const parsed = TaxWithholdingAccountInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(taxWithholdingAccount).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Tax Withholding Account.
 */
export async function updateTaxWithholdingAccount(db: any, id: string, data: unknown) {
  const parsed = TaxWithholdingAccountInsertSchema.partial().parse(data);
  await db.update(taxWithholdingAccount).set({ ...parsed, modified: new Date() }).where(eq(taxWithholdingAccount.id, id));
  return getTaxWithholdingAccount(db, id);
}

/**
 * Delete a Tax Withholding Account by ID.
 */
export async function deleteTaxWithholdingAccount(db: any, id: string) {
  await db.delete(taxWithholdingAccount).where(eq(taxWithholdingAccount.id, id));
  return { deleted: true, id };
}
