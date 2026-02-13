// CRUD API handlers for Accounting Dimension
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { accountingDimension } from '../db/schema.js';
import { AccountingDimensionSchema, AccountingDimensionInsertSchema } from '../types/accounting-dimension.js';

export const ROUTE_PREFIX = '/accounting-dimension';

/**
 * List Accounting Dimension records.
 */
export async function listAccountingDimension(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(accountingDimension).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Accounting Dimension by ID.
 */
export async function getAccountingDimension(db: any, id: string) {
  const rows = await db.select().from(accountingDimension).where(eq(accountingDimension.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Accounting Dimension.
 */
export async function createAccountingDimension(db: any, data: unknown) {
  const parsed = AccountingDimensionInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(accountingDimension).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Accounting Dimension.
 */
export async function updateAccountingDimension(db: any, id: string, data: unknown) {
  const parsed = AccountingDimensionInsertSchema.partial().parse(data);
  await db.update(accountingDimension).set({ ...parsed, modified: new Date() }).where(eq(accountingDimension.id, id));
  return getAccountingDimension(db, id);
}

/**
 * Delete a Accounting Dimension by ID.
 */
export async function deleteAccountingDimension(db: any, id: string) {
  await db.delete(accountingDimension).where(eq(accountingDimension.id, id));
  return { deleted: true, id };
}
