// CRUD API handlers for Asset Finance Book
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { assetFinanceBook } from '../db/schema.js';
import { AssetFinanceBookSchema, AssetFinanceBookInsertSchema } from '../types/asset-finance-book.js';

export const ROUTE_PREFIX = '/asset-finance-book';

/**
 * List Asset Finance Book records.
 */
export async function listAssetFinanceBook(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(assetFinanceBook).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Asset Finance Book by ID.
 */
export async function getAssetFinanceBook(db: any, id: string) {
  const rows = await db.select().from(assetFinanceBook).where(eq(assetFinanceBook.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Asset Finance Book.
 */
export async function createAssetFinanceBook(db: any, data: unknown) {
  const parsed = AssetFinanceBookInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(assetFinanceBook).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Asset Finance Book.
 */
export async function updateAssetFinanceBook(db: any, id: string, data: unknown) {
  const parsed = AssetFinanceBookInsertSchema.partial().parse(data);
  await db.update(assetFinanceBook).set({ ...parsed, modified: new Date() }).where(eq(assetFinanceBook.id, id));
  return getAssetFinanceBook(db, id);
}

/**
 * Delete a Asset Finance Book by ID.
 */
export async function deleteAssetFinanceBook(db: any, id: string) {
  await db.delete(assetFinanceBook).where(eq(assetFinanceBook.id, id));
  return { deleted: true, id };
}
