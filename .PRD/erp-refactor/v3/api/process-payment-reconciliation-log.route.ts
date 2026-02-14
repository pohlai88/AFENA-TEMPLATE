// CRUD API handlers for Process Payment Reconciliation Log
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { processPaymentReconciliationLog } from '../db/schema.js';
import { ProcessPaymentReconciliationLogSchema, ProcessPaymentReconciliationLogInsertSchema } from '../types/process-payment-reconciliation-log.js';

export const ROUTE_PREFIX = '/process-payment-reconciliation-log';

/**
 * List Process Payment Reconciliation Log records.
 */
export async function listProcessPaymentReconciliationLog(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(processPaymentReconciliationLog).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Process Payment Reconciliation Log by ID.
 */
export async function getProcessPaymentReconciliationLog(db: any, id: string) {
  const rows = await db.select().from(processPaymentReconciliationLog).where(eq(processPaymentReconciliationLog.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Process Payment Reconciliation Log.
 */
export async function createProcessPaymentReconciliationLog(db: any, data: unknown) {
  const parsed = ProcessPaymentReconciliationLogInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(processPaymentReconciliationLog).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Process Payment Reconciliation Log.
 */
export async function updateProcessPaymentReconciliationLog(db: any, id: string, data: unknown) {
  const parsed = ProcessPaymentReconciliationLogInsertSchema.partial().parse(data);
  await db.update(processPaymentReconciliationLog).set({ ...parsed, modified: new Date() }).where(eq(processPaymentReconciliationLog.id, id));
  return getProcessPaymentReconciliationLog(db, id);
}

/**
 * Delete a Process Payment Reconciliation Log by ID.
 */
export async function deleteProcessPaymentReconciliationLog(db: any, id: string) {
  await db.delete(processPaymentReconciliationLog).where(eq(processPaymentReconciliationLog.id, id));
  return { deleted: true, id };
}
