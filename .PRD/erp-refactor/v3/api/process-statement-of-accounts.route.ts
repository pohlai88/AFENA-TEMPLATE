// CRUD API handlers for Process Statement Of Accounts
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { processStatementOfAccounts } from '../db/schema.js';
import { ProcessStatementOfAccountsSchema, ProcessStatementOfAccountsInsertSchema } from '../types/process-statement-of-accounts.js';

export const ROUTE_PREFIX = '/process-statement-of-accounts';

/**
 * List Process Statement Of Accounts records.
 */
export async function listProcessStatementOfAccounts(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(processStatementOfAccounts).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Process Statement Of Accounts by ID.
 */
export async function getProcessStatementOfAccounts(db: any, id: string) {
  const rows = await db.select().from(processStatementOfAccounts).where(eq(processStatementOfAccounts.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Process Statement Of Accounts.
 */
export async function createProcessStatementOfAccounts(db: any, data: unknown) {
  const parsed = ProcessStatementOfAccountsInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(processStatementOfAccounts).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Process Statement Of Accounts.
 */
export async function updateProcessStatementOfAccounts(db: any, id: string, data: unknown) {
  const parsed = ProcessStatementOfAccountsInsertSchema.partial().parse(data);
  await db.update(processStatementOfAccounts).set({ ...parsed, modified: new Date() }).where(eq(processStatementOfAccounts.id, id));
  return getProcessStatementOfAccounts(db, id);
}

/**
 * Delete a Process Statement Of Accounts by ID.
 */
export async function deleteProcessStatementOfAccounts(db: any, id: string) {
  await db.delete(processStatementOfAccounts).where(eq(processStatementOfAccounts.id, id));
  return { deleted: true, id };
}
