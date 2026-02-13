// CRUD API handlers for Transaction Deletion Record Item
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { transactionDeletionRecordItem } from '../db/schema.js';
import { TransactionDeletionRecordItemSchema, TransactionDeletionRecordItemInsertSchema } from '../types/transaction-deletion-record-item.js';

export const ROUTE_PREFIX = '/transaction-deletion-record-item';

/**
 * List Transaction Deletion Record Item records.
 */
export async function listTransactionDeletionRecordItem(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(transactionDeletionRecordItem).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Transaction Deletion Record Item by ID.
 */
export async function getTransactionDeletionRecordItem(db: any, id: string) {
  const rows = await db.select().from(transactionDeletionRecordItem).where(eq(transactionDeletionRecordItem.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Transaction Deletion Record Item.
 */
export async function createTransactionDeletionRecordItem(db: any, data: unknown) {
  const parsed = TransactionDeletionRecordItemInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(transactionDeletionRecordItem).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Transaction Deletion Record Item.
 */
export async function updateTransactionDeletionRecordItem(db: any, id: string, data: unknown) {
  const parsed = TransactionDeletionRecordItemInsertSchema.partial().parse(data);
  await db.update(transactionDeletionRecordItem).set({ ...parsed, modified: new Date() }).where(eq(transactionDeletionRecordItem.id, id));
  return getTransactionDeletionRecordItem(db, id);
}

/**
 * Delete a Transaction Deletion Record Item by ID.
 */
export async function deleteTransactionDeletionRecordItem(db: any, id: string) {
  await db.delete(transactionDeletionRecordItem).where(eq(transactionDeletionRecordItem.id, id));
  return { deleted: true, id };
}
