// CRUD API handlers for Transaction Deletion Record
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { transactionDeletionRecord } from '../db/schema.js';
import { TransactionDeletionRecordSchema, TransactionDeletionRecordInsertSchema } from '../types/transaction-deletion-record.js';

export const ROUTE_PREFIX = '/transaction-deletion-record';

/**
 * List Transaction Deletion Record records.
 */
export async function listTransactionDeletionRecord(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(transactionDeletionRecord).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Transaction Deletion Record by ID.
 */
export async function getTransactionDeletionRecord(db: any, id: string) {
  const rows = await db.select().from(transactionDeletionRecord).where(eq(transactionDeletionRecord.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Transaction Deletion Record.
 */
export async function createTransactionDeletionRecord(db: any, data: unknown) {
  const parsed = TransactionDeletionRecordInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(transactionDeletionRecord).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Transaction Deletion Record.
 */
export async function updateTransactionDeletionRecord(db: any, id: string, data: unknown) {
  const parsed = TransactionDeletionRecordInsertSchema.partial().parse(data);
  await db.update(transactionDeletionRecord).set({ ...parsed, modified: new Date() }).where(eq(transactionDeletionRecord.id, id));
  return getTransactionDeletionRecord(db, id);
}

/**
 * Delete a Transaction Deletion Record by ID.
 */
export async function deleteTransactionDeletionRecord(db: any, id: string) {
  await db.delete(transactionDeletionRecord).where(eq(transactionDeletionRecord.id, id));
  return { deleted: true, id };
}

/**
 * Submit a Transaction Deletion Record (set docstatus = 1).
 */
export async function submitTransactionDeletionRecord(db: any, id: string) {
  await db.update(transactionDeletionRecord).set({ docstatus: 1, modified: new Date() }).where(eq(transactionDeletionRecord.id, id));
  return getTransactionDeletionRecord(db, id);
}

/**
 * Cancel a Transaction Deletion Record (set docstatus = 2).
 */
export async function cancelTransactionDeletionRecord(db: any, id: string) {
  await db.update(transactionDeletionRecord).set({ docstatus: 2, modified: new Date() }).where(eq(transactionDeletionRecord.id, id));
  return getTransactionDeletionRecord(db, id);
}
