// CRUD API handlers for Process Statement Of Accounts Customer
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { processStatementOfAccountsCustomer } from '../db/schema.js';
import { ProcessStatementOfAccountsCustomerSchema, ProcessStatementOfAccountsCustomerInsertSchema } from '../types/process-statement-of-accounts-customer.js';

export const ROUTE_PREFIX = '/process-statement-of-accounts-customer';

/**
 * List Process Statement Of Accounts Customer records.
 */
export async function listProcessStatementOfAccountsCustomer(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(processStatementOfAccountsCustomer).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Process Statement Of Accounts Customer by ID.
 */
export async function getProcessStatementOfAccountsCustomer(db: any, id: string) {
  const rows = await db.select().from(processStatementOfAccountsCustomer).where(eq(processStatementOfAccountsCustomer.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Process Statement Of Accounts Customer.
 */
export async function createProcessStatementOfAccountsCustomer(db: any, data: unknown) {
  const parsed = ProcessStatementOfAccountsCustomerInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(processStatementOfAccountsCustomer).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Process Statement Of Accounts Customer.
 */
export async function updateProcessStatementOfAccountsCustomer(db: any, id: string, data: unknown) {
  const parsed = ProcessStatementOfAccountsCustomerInsertSchema.partial().parse(data);
  await db.update(processStatementOfAccountsCustomer).set({ ...parsed, modified: new Date() }).where(eq(processStatementOfAccountsCustomer.id, id));
  return getProcessStatementOfAccountsCustomer(db, id);
}

/**
 * Delete a Process Statement Of Accounts Customer by ID.
 */
export async function deleteProcessStatementOfAccountsCustomer(db: any, id: string) {
  await db.delete(processStatementOfAccountsCustomer).where(eq(processStatementOfAccountsCustomer.id, id));
  return { deleted: true, id };
}
