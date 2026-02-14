// CRUD API handlers for Transaction Deletion Record Details
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { transactionDeletionRecordDetails } from '../db/schema.js';
import { TransactionDeletionRecordDetailsSchema, TransactionDeletionRecordDetailsInsertSchema } from '../types/transaction-deletion-record-details.js';

export const ROUTE_PREFIX = '/transaction-deletion-record-details';

/**
 * List Transaction Deletion Record Details records.
 */
export async function listTransactionDeletionRecordDetails(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(transactionDeletionRecordDetails).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Transaction Deletion Record Details by ID.
 */
export async function getTransactionDeletionRecordDetails(db: any, id: string) {
  const rows = await db.select().from(transactionDeletionRecordDetails).where(eq(transactionDeletionRecordDetails.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Transaction Deletion Record Details.
 */
export async function createTransactionDeletionRecordDetails(db: any, data: unknown) {
  const parsed = TransactionDeletionRecordDetailsInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(transactionDeletionRecordDetails).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Transaction Deletion Record Details.
 */
export async function updateTransactionDeletionRecordDetails(db: any, id: string, data: unknown) {
  const parsed = TransactionDeletionRecordDetailsInsertSchema.partial().parse(data);
  await db.update(transactionDeletionRecordDetails).set({ ...parsed, modified: new Date() }).where(eq(transactionDeletionRecordDetails.id, id));
  return getTransactionDeletionRecordDetails(db, id);
}

/**
 * Delete a Transaction Deletion Record Details by ID.
 */
export async function deleteTransactionDeletionRecordDetails(db: any, id: string) {
  await db.delete(transactionDeletionRecordDetails).where(eq(transactionDeletionRecordDetails.id, id));
  return { deleted: true, id };
}
