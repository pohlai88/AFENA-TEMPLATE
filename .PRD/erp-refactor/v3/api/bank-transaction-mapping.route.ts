// CRUD API handlers for Bank Transaction Mapping
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { bankTransactionMapping } from '../db/schema.js';
import { BankTransactionMappingSchema, BankTransactionMappingInsertSchema } from '../types/bank-transaction-mapping.js';

export const ROUTE_PREFIX = '/bank-transaction-mapping';

/**
 * List Bank Transaction Mapping records.
 */
export async function listBankTransactionMapping(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(bankTransactionMapping).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Bank Transaction Mapping by ID.
 */
export async function getBankTransactionMapping(db: any, id: string) {
  const rows = await db.select().from(bankTransactionMapping).where(eq(bankTransactionMapping.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Bank Transaction Mapping.
 */
export async function createBankTransactionMapping(db: any, data: unknown) {
  const parsed = BankTransactionMappingInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(bankTransactionMapping).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Bank Transaction Mapping.
 */
export async function updateBankTransactionMapping(db: any, id: string, data: unknown) {
  const parsed = BankTransactionMappingInsertSchema.partial().parse(data);
  await db.update(bankTransactionMapping).set({ ...parsed, modified: new Date() }).where(eq(bankTransactionMapping.id, id));
  return getBankTransactionMapping(db, id);
}

/**
 * Delete a Bank Transaction Mapping by ID.
 */
export async function deleteBankTransactionMapping(db: any, id: string) {
  await db.delete(bankTransactionMapping).where(eq(bankTransactionMapping.id, id));
  return { deleted: true, id };
}
