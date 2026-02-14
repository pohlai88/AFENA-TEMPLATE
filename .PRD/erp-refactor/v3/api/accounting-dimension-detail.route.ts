// CRUD API handlers for Accounting Dimension Detail
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { accountingDimensionDetail } from '../db/schema.js';
import { AccountingDimensionDetailSchema, AccountingDimensionDetailInsertSchema } from '../types/accounting-dimension-detail.js';

export const ROUTE_PREFIX = '/accounting-dimension-detail';

/**
 * List Accounting Dimension Detail records.
 */
export async function listAccountingDimensionDetail(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(accountingDimensionDetail).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Accounting Dimension Detail by ID.
 */
export async function getAccountingDimensionDetail(db: any, id: string) {
  const rows = await db.select().from(accountingDimensionDetail).where(eq(accountingDimensionDetail.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Accounting Dimension Detail.
 */
export async function createAccountingDimensionDetail(db: any, data: unknown) {
  const parsed = AccountingDimensionDetailInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(accountingDimensionDetail).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Accounting Dimension Detail.
 */
export async function updateAccountingDimensionDetail(db: any, id: string, data: unknown) {
  const parsed = AccountingDimensionDetailInsertSchema.partial().parse(data);
  await db.update(accountingDimensionDetail).set({ ...parsed, modified: new Date() }).where(eq(accountingDimensionDetail.id, id));
  return getAccountingDimensionDetail(db, id);
}

/**
 * Delete a Accounting Dimension Detail by ID.
 */
export async function deleteAccountingDimensionDetail(db: any, id: string) {
  await db.delete(accountingDimensionDetail).where(eq(accountingDimensionDetail.id, id));
  return { deleted: true, id };
}
