// CRUD API handlers for Accounting Period
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { accountingPeriod } from '../db/schema.js';
import { AccountingPeriodSchema, AccountingPeriodInsertSchema } from '../types/accounting-period.js';

export const ROUTE_PREFIX = '/accounting-period';

/**
 * List Accounting Period records.
 */
export async function listAccountingPeriod(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(accountingPeriod).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Accounting Period by ID.
 */
export async function getAccountingPeriod(db: any, id: string) {
  const rows = await db.select().from(accountingPeriod).where(eq(accountingPeriod.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Accounting Period.
 */
export async function createAccountingPeriod(db: any, data: unknown) {
  const parsed = AccountingPeriodInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(accountingPeriod).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Accounting Period.
 */
export async function updateAccountingPeriod(db: any, id: string, data: unknown) {
  const parsed = AccountingPeriodInsertSchema.partial().parse(data);
  await db.update(accountingPeriod).set({ ...parsed, modified: new Date() }).where(eq(accountingPeriod.id, id));
  return getAccountingPeriod(db, id);
}

/**
 * Delete a Accounting Period by ID.
 */
export async function deleteAccountingPeriod(db: any, id: string) {
  await db.delete(accountingPeriod).where(eq(accountingPeriod.id, id));
  return { deleted: true, id };
}
