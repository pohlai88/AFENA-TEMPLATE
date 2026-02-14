// CRUD API handlers for Bank Clearance Detail
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { bankClearanceDetail } from '../db/schema.js';
import { BankClearanceDetailSchema, BankClearanceDetailInsertSchema } from '../types/bank-clearance-detail.js';

export const ROUTE_PREFIX = '/bank-clearance-detail';

/**
 * List Bank Clearance Detail records.
 */
export async function listBankClearanceDetail(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(bankClearanceDetail).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Bank Clearance Detail by ID.
 */
export async function getBankClearanceDetail(db: any, id: string) {
  const rows = await db.select().from(bankClearanceDetail).where(eq(bankClearanceDetail.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Bank Clearance Detail.
 */
export async function createBankClearanceDetail(db: any, data: unknown) {
  const parsed = BankClearanceDetailInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(bankClearanceDetail).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Bank Clearance Detail.
 */
export async function updateBankClearanceDetail(db: any, id: string, data: unknown) {
  const parsed = BankClearanceDetailInsertSchema.partial().parse(data);
  await db.update(bankClearanceDetail).set({ ...parsed, modified: new Date() }).where(eq(bankClearanceDetail.id, id));
  return getBankClearanceDetail(db, id);
}

/**
 * Delete a Bank Clearance Detail by ID.
 */
export async function deleteBankClearanceDetail(db: any, id: string) {
  await db.delete(bankClearanceDetail).where(eq(bankClearanceDetail.id, id));
  return { deleted: true, id };
}
