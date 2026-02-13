// CRUD API handlers for Accounting Dimension Filter
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { accountingDimensionFilter } from '../db/schema.js';
import { AccountingDimensionFilterSchema, AccountingDimensionFilterInsertSchema } from '../types/accounting-dimension-filter.js';

export const ROUTE_PREFIX = '/accounting-dimension-filter';

/**
 * List Accounting Dimension Filter records.
 */
export async function listAccountingDimensionFilter(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(accountingDimensionFilter).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Accounting Dimension Filter by ID.
 */
export async function getAccountingDimensionFilter(db: any, id: string) {
  const rows = await db.select().from(accountingDimensionFilter).where(eq(accountingDimensionFilter.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Accounting Dimension Filter.
 */
export async function createAccountingDimensionFilter(db: any, data: unknown) {
  const parsed = AccountingDimensionFilterInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(accountingDimensionFilter).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Accounting Dimension Filter.
 */
export async function updateAccountingDimensionFilter(db: any, id: string, data: unknown) {
  const parsed = AccountingDimensionFilterInsertSchema.partial().parse(data);
  await db.update(accountingDimensionFilter).set({ ...parsed, modified: new Date() }).where(eq(accountingDimensionFilter.id, id));
  return getAccountingDimensionFilter(db, id);
}

/**
 * Delete a Accounting Dimension Filter by ID.
 */
export async function deleteAccountingDimensionFilter(db: any, id: string) {
  await db.delete(accountingDimensionFilter).where(eq(accountingDimensionFilter.id, id));
  return { deleted: true, id };
}
