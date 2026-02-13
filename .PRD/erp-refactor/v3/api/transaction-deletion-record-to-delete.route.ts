// CRUD API handlers for Transaction Deletion Record To Delete
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { transactionDeletionRecordToDelete } from '../db/schema.js';
import { TransactionDeletionRecordToDeleteSchema, TransactionDeletionRecordToDeleteInsertSchema } from '../types/transaction-deletion-record-to-delete.js';

export const ROUTE_PREFIX = '/transaction-deletion-record-to-delete';

/**
 * List Transaction Deletion Record To Delete records.
 */
export async function listTransactionDeletionRecordToDelete(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(transactionDeletionRecordToDelete).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Transaction Deletion Record To Delete by ID.
 */
export async function getTransactionDeletionRecordToDelete(db: any, id: string) {
  const rows = await db.select().from(transactionDeletionRecordToDelete).where(eq(transactionDeletionRecordToDelete.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Transaction Deletion Record To Delete.
 */
export async function createTransactionDeletionRecordToDelete(db: any, data: unknown) {
  const parsed = TransactionDeletionRecordToDeleteInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(transactionDeletionRecordToDelete).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Transaction Deletion Record To Delete.
 */
export async function updateTransactionDeletionRecordToDelete(db: any, id: string, data: unknown) {
  const parsed = TransactionDeletionRecordToDeleteInsertSchema.partial().parse(data);
  await db.update(transactionDeletionRecordToDelete).set({ ...parsed, modified: new Date() }).where(eq(transactionDeletionRecordToDelete.id, id));
  return getTransactionDeletionRecordToDelete(db, id);
}

/**
 * Delete a Transaction Deletion Record To Delete by ID.
 */
export async function deleteTransactionDeletionRecordToDelete(db: any, id: string) {
  await db.delete(transactionDeletionRecordToDelete).where(eq(transactionDeletionRecordToDelete.id, id));
  return { deleted: true, id };
}
