// CRUD API handlers for Process Deferred Accounting
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { processDeferredAccounting } from '../db/schema.js';
import { ProcessDeferredAccountingSchema, ProcessDeferredAccountingInsertSchema } from '../types/process-deferred-accounting.js';

export const ROUTE_PREFIX = '/process-deferred-accounting';

/**
 * List Process Deferred Accounting records.
 */
export async function listProcessDeferredAccounting(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(processDeferredAccounting).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Process Deferred Accounting by ID.
 */
export async function getProcessDeferredAccounting(db: any, id: string) {
  const rows = await db.select().from(processDeferredAccounting).where(eq(processDeferredAccounting.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Process Deferred Accounting.
 */
export async function createProcessDeferredAccounting(db: any, data: unknown) {
  const parsed = ProcessDeferredAccountingInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(processDeferredAccounting).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Process Deferred Accounting.
 */
export async function updateProcessDeferredAccounting(db: any, id: string, data: unknown) {
  const parsed = ProcessDeferredAccountingInsertSchema.partial().parse(data);
  await db.update(processDeferredAccounting).set({ ...parsed, modified: new Date() }).where(eq(processDeferredAccounting.id, id));
  return getProcessDeferredAccounting(db, id);
}

/**
 * Delete a Process Deferred Accounting by ID.
 */
export async function deleteProcessDeferredAccounting(db: any, id: string) {
  await db.delete(processDeferredAccounting).where(eq(processDeferredAccounting.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Process Deferred Accounting (set docstatus = 1).
 */
export async function submitProcessDeferredAccounting(db: any, id: string) {
  await db.update(processDeferredAccounting).set({ docstatus: 1, modified: new Date() }).where(eq(processDeferredAccounting.id, id));
  return getProcessDeferredAccounting(db, id);
}

/**
 * Cancel a Process Deferred Accounting (set docstatus = 2).
 */
export async function cancelProcessDeferredAccounting(db: any, id: string) {
  await db.update(processDeferredAccounting).set({ docstatus: 2, modified: new Date() }).where(eq(processDeferredAccounting.id, id));
  return getProcessDeferredAccounting(db, id);
}
