// CRUD API handlers for Process Payment Reconciliation Log Allocations
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { processPaymentReconciliationLogAllocations } from '../db/schema.js';
import { ProcessPaymentReconciliationLogAllocationsSchema, ProcessPaymentReconciliationLogAllocationsInsertSchema } from '../types/process-payment-reconciliation-log-allocations.js';

export const ROUTE_PREFIX = '/process-payment-reconciliation-log-allocations';

/**
 * List Process Payment Reconciliation Log Allocations records.
 */
export async function listProcessPaymentReconciliationLogAllocations(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(processPaymentReconciliationLogAllocations).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Process Payment Reconciliation Log Allocations by ID.
 */
export async function getProcessPaymentReconciliationLogAllocations(db: any, id: string) {
  const rows = await db.select().from(processPaymentReconciliationLogAllocations).where(eq(processPaymentReconciliationLogAllocations.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Process Payment Reconciliation Log Allocations.
 */
export async function createProcessPaymentReconciliationLogAllocations(db: any, data: unknown) {
  const parsed = ProcessPaymentReconciliationLogAllocationsInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(processPaymentReconciliationLogAllocations).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Process Payment Reconciliation Log Allocations.
 */
export async function updateProcessPaymentReconciliationLogAllocations(db: any, id: string, data: unknown) {
  const parsed = ProcessPaymentReconciliationLogAllocationsInsertSchema.partial().parse(data);
  await db.update(processPaymentReconciliationLogAllocations).set({ ...parsed, modified: new Date() }).where(eq(processPaymentReconciliationLogAllocations.id, id));
  return getProcessPaymentReconciliationLogAllocations(db, id);
}

/**
 * Delete a Process Payment Reconciliation Log Allocations by ID.
 */
export async function deleteProcessPaymentReconciliationLogAllocations(db: any, id: string) {
  await db.delete(processPaymentReconciliationLogAllocations).where(eq(processPaymentReconciliationLogAllocations.id, id));
  return { deleted: true, id };
}
