// CRUD API handlers for Bank Guarantee
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { bankGuarantee } from '../db/schema.js';
import { BankGuaranteeSchema, BankGuaranteeInsertSchema } from '../types/bank-guarantee.js';

export const ROUTE_PREFIX = '/bank-guarantee';

/**
 * List Bank Guarantee records.
 */
export async function listBankGuarantee(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(bankGuarantee).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Bank Guarantee by ID.
 */
export async function getBankGuarantee(db: any, id: string) {
  const rows = await db.select().from(bankGuarantee).where(eq(bankGuarantee.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Bank Guarantee.
 */
export async function createBankGuarantee(db: any, data: unknown) {
  const parsed = BankGuaranteeInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(bankGuarantee).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Bank Guarantee.
 */
export async function updateBankGuarantee(db: any, id: string, data: unknown) {
  const parsed = BankGuaranteeInsertSchema.partial().parse(data);
  await db.update(bankGuarantee).set({ ...parsed, modified: new Date() }).where(eq(bankGuarantee.id, id));
  return getBankGuarantee(db, id);
}

/**
 * Delete a Bank Guarantee by ID.
 */
export async function deleteBankGuarantee(db: any, id: string) {
  await db.delete(bankGuarantee).where(eq(bankGuarantee.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Bank Guarantee (set docstatus = 1).
 */
export async function submitBankGuarantee(db: any, id: string) {
  await db.update(bankGuarantee).set({ docstatus: 1, modified: new Date() }).where(eq(bankGuarantee.id, id));
  return getBankGuarantee(db, id);
}

/**
 * Cancel a Bank Guarantee (set docstatus = 2).
 */
export async function cancelBankGuarantee(db: any, id: string) {
  await db.update(bankGuarantee).set({ docstatus: 2, modified: new Date() }).where(eq(bankGuarantee.id, id));
  return getBankGuarantee(db, id);
}
