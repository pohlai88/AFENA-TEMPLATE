// CRUD API handlers for Bank Clearance
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { bankClearance } from '../db/schema.js';
import { BankClearanceSchema, BankClearanceInsertSchema } from '../types/bank-clearance.js';

export const ROUTE_PREFIX = '/bank-clearance';

/**
 * List Bank Clearance records.
 */
export async function listBankClearance(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(bankClearance).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Bank Clearance by ID.
 */
export async function getBankClearance(db: any, id: string) {
  const rows = await db.select().from(bankClearance).where(eq(bankClearance.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Bank Clearance.
 */
export async function createBankClearance(db: any, data: unknown) {
  const parsed = BankClearanceInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(bankClearance).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Bank Clearance.
 */
export async function updateBankClearance(db: any, id: string, data: unknown) {
  const parsed = BankClearanceInsertSchema.partial().parse(data);
  await db.update(bankClearance).set({ ...parsed, modified: new Date() }).where(eq(bankClearance.id, id));
  return getBankClearance(db, id);
}

/**
 * Delete a Bank Clearance by ID.
 */
export async function deleteBankClearance(db: any, id: string) {
  await db.delete(bankClearance).where(eq(bankClearance.id, id));
  return { deleted: true, id };
}
