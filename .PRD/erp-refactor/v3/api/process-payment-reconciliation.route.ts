// CRUD API handlers for Process Payment Reconciliation
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { processPaymentReconciliation } from '../db/schema.js';
import { ProcessPaymentReconciliationSchema, ProcessPaymentReconciliationInsertSchema } from '../types/process-payment-reconciliation.js';

export const ROUTE_PREFIX = '/process-payment-reconciliation';

/**
 * List Process Payment Reconciliation records.
 */
export async function listProcessPaymentReconciliation(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(processPaymentReconciliation).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Process Payment Reconciliation by ID.
 */
export async function getProcessPaymentReconciliation(db: any, id: string) {
  const rows = await db.select().from(processPaymentReconciliation).where(eq(processPaymentReconciliation.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Process Payment Reconciliation.
 */
export async function createProcessPaymentReconciliation(db: any, data: unknown) {
  const parsed = ProcessPaymentReconciliationInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(processPaymentReconciliation).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Process Payment Reconciliation.
 */
export async function updateProcessPaymentReconciliation(db: any, id: string, data: unknown) {
  const parsed = ProcessPaymentReconciliationInsertSchema.partial().parse(data);
  await db.update(processPaymentReconciliation).set({ ...parsed, modified: new Date() }).where(eq(processPaymentReconciliation.id, id));
  return getProcessPaymentReconciliation(db, id);
}

/**
 * Delete a Process Payment Reconciliation by ID.
 */
export async function deleteProcessPaymentReconciliation(db: any, id: string) {
  await db.delete(processPaymentReconciliation).where(eq(processPaymentReconciliation.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Process Payment Reconciliation (set docstatus = 1).
 */
export async function submitProcessPaymentReconciliation(db: any, id: string) {
  await db.update(processPaymentReconciliation).set({ docstatus: 1, modified: new Date() }).where(eq(processPaymentReconciliation.id, id));
  return getProcessPaymentReconciliation(db, id);
}

/**
 * Cancel a Process Payment Reconciliation (set docstatus = 2).
 */
export async function cancelProcessPaymentReconciliation(db: any, id: string) {
  await db.update(processPaymentReconciliation).set({ docstatus: 2, modified: new Date() }).where(eq(processPaymentReconciliation.id, id));
  return getProcessPaymentReconciliation(db, id);
}
