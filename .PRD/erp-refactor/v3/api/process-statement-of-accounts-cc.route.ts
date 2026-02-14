// CRUD API handlers for Process Statement Of Accounts CC
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { processStatementOfAccountsCc } from '../db/schema.js';
import { ProcessStatementOfAccountsCcSchema, ProcessStatementOfAccountsCcInsertSchema } from '../types/process-statement-of-accounts-cc.js';

export const ROUTE_PREFIX = '/process-statement-of-accounts-cc';

/**
 * List Process Statement Of Accounts CC records.
 */
export async function listProcessStatementOfAccountsCc(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(processStatementOfAccountsCc).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Process Statement Of Accounts CC by ID.
 */
export async function getProcessStatementOfAccountsCc(db: any, id: string) {
  const rows = await db.select().from(processStatementOfAccountsCc).where(eq(processStatementOfAccountsCc.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Process Statement Of Accounts CC.
 */
export async function createProcessStatementOfAccountsCc(db: any, data: unknown) {
  const parsed = ProcessStatementOfAccountsCcInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(processStatementOfAccountsCc).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Process Statement Of Accounts CC.
 */
export async function updateProcessStatementOfAccountsCc(db: any, id: string, data: unknown) {
  const parsed = ProcessStatementOfAccountsCcInsertSchema.partial().parse(data);
  await db.update(processStatementOfAccountsCc).set({ ...parsed, modified: new Date() }).where(eq(processStatementOfAccountsCc.id, id));
  return getProcessStatementOfAccountsCc(db, id);
}

/**
 * Delete a Process Statement Of Accounts CC by ID.
 */
export async function deleteProcessStatementOfAccountsCc(db: any, id: string) {
  await db.delete(processStatementOfAccountsCc).where(eq(processStatementOfAccountsCc.id, id));
  return { deleted: true, id };
}
