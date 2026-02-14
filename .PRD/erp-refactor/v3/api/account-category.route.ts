// CRUD API handlers for Account Category
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { accountCategory } from '../db/schema.js';
import { AccountCategorySchema, AccountCategoryInsertSchema } from '../types/account-category.js';

export const ROUTE_PREFIX = '/account-category';

/**
 * List Account Category records.
 */
export async function listAccountCategory(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(accountCategory).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Account Category by ID.
 */
export async function getAccountCategory(db: any, id: string) {
  const rows = await db.select().from(accountCategory).where(eq(accountCategory.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Account Category.
 */
export async function createAccountCategory(db: any, data: unknown) {
  const parsed = AccountCategoryInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(accountCategory).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Account Category.
 */
export async function updateAccountCategory(db: any, id: string, data: unknown) {
  const parsed = AccountCategoryInsertSchema.partial().parse(data);
  await db.update(accountCategory).set({ ...parsed, modified: new Date() }).where(eq(accountCategory.id, id));
  return getAccountCategory(db, id);
}

/**
 * Delete a Account Category by ID.
 */
export async function deleteAccountCategory(db: any, id: string) {
  await db.delete(accountCategory).where(eq(accountCategory.id, id));
  return { deleted: true, id };
}
