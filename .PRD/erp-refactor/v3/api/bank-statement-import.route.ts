// CRUD API handlers for Bank Statement Import
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { bankStatementImport } from '../db/schema.js';
import { BankStatementImportSchema, BankStatementImportInsertSchema } from '../types/bank-statement-import.js';

export const ROUTE_PREFIX = '/bank-statement-import';

/**
 * List Bank Statement Import records.
 */
export async function listBankStatementImport(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(bankStatementImport).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Bank Statement Import by ID.
 */
export async function getBankStatementImport(db: any, id: string) {
  const rows = await db.select().from(bankStatementImport).where(eq(bankStatementImport.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Bank Statement Import.
 */
export async function createBankStatementImport(db: any, data: unknown) {
  const parsed = BankStatementImportInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(bankStatementImport).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Bank Statement Import.
 */
export async function updateBankStatementImport(db: any, id: string, data: unknown) {
  const parsed = BankStatementImportInsertSchema.partial().parse(data);
  await db.update(bankStatementImport).set({ ...parsed, modified: new Date() }).where(eq(bankStatementImport.id, id));
  return getBankStatementImport(db, id);
}

/**
 * Delete a Bank Statement Import by ID.
 */
export async function deleteBankStatementImport(db: any, id: string) {
  await db.delete(bankStatementImport).where(eq(bankStatementImport.id, id));
  return { deleted: true, id };
}
