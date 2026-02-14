// CRUD API handlers for Finance Book
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { financeBook } from '../db/schema.js';
import { FinanceBookSchema, FinanceBookInsertSchema } from '../types/finance-book.js';

export const ROUTE_PREFIX = '/finance-book';

/**
 * List Finance Book records.
 */
export async function listFinanceBook(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(financeBook).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Finance Book by ID.
 */
export async function getFinanceBook(db: any, id: string) {
  const rows = await db.select().from(financeBook).where(eq(financeBook.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Finance Book.
 */
export async function createFinanceBook(db: any, data: unknown) {
  const parsed = FinanceBookInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(financeBook).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Finance Book.
 */
export async function updateFinanceBook(db: any, id: string, data: unknown) {
  const parsed = FinanceBookInsertSchema.partial().parse(data);
  await db.update(financeBook).set({ ...parsed, modified: new Date() }).where(eq(financeBook.id, id));
  return getFinanceBook(db, id);
}

/**
 * Delete a Finance Book by ID.
 */
export async function deleteFinanceBook(db: any, id: string) {
  await db.delete(financeBook).where(eq(financeBook.id, id));
  return { deleted: true, id };
}
