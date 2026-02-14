// CRUD API handlers for Bank Reconciliation Tool
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { bankReconciliationTool } from '../db/schema.js';
import { BankReconciliationToolSchema, BankReconciliationToolInsertSchema } from '../types/bank-reconciliation-tool.js';

export const ROUTE_PREFIX = '/bank-reconciliation-tool';

/**
 * List Bank Reconciliation Tool records.
 */
export async function listBankReconciliationTool(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(bankReconciliationTool).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Bank Reconciliation Tool by ID.
 */
export async function getBankReconciliationTool(db: any, id: string) {
  const rows = await db.select().from(bankReconciliationTool).where(eq(bankReconciliationTool.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Bank Reconciliation Tool.
 */
export async function createBankReconciliationTool(db: any, data: unknown) {
  const parsed = BankReconciliationToolInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(bankReconciliationTool).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Bank Reconciliation Tool.
 */
export async function updateBankReconciliationTool(db: any, id: string, data: unknown) {
  const parsed = BankReconciliationToolInsertSchema.partial().parse(data);
  await db.update(bankReconciliationTool).set({ ...parsed, modified: new Date() }).where(eq(bankReconciliationTool.id, id));
  return getBankReconciliationTool(db, id);
}

/**
 * Delete a Bank Reconciliation Tool by ID.
 */
export async function deleteBankReconciliationTool(db: any, id: string) {
  await db.delete(bankReconciliationTool).where(eq(bankReconciliationTool.id, id));
  return { deleted: true, id };
}
