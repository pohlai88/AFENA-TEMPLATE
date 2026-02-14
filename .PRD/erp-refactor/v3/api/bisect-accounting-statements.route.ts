// CRUD API handlers for Bisect Accounting Statements
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { bisectAccountingStatements } from '../db/schema.js';
import { BisectAccountingStatementsSchema, BisectAccountingStatementsInsertSchema } from '../types/bisect-accounting-statements.js';

export const ROUTE_PREFIX = '/bisect-accounting-statements';

/**
 * List Bisect Accounting Statements records.
 */
export async function listBisectAccountingStatements(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(bisectAccountingStatements).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Bisect Accounting Statements by ID.
 */
export async function getBisectAccountingStatements(db: any, id: string) {
  const rows = await db.select().from(bisectAccountingStatements).where(eq(bisectAccountingStatements.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Bisect Accounting Statements.
 */
export async function createBisectAccountingStatements(db: any, data: unknown) {
  const parsed = BisectAccountingStatementsInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(bisectAccountingStatements).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Bisect Accounting Statements.
 */
export async function updateBisectAccountingStatements(db: any, id: string, data: unknown) {
  const parsed = BisectAccountingStatementsInsertSchema.partial().parse(data);
  await db.update(bisectAccountingStatements).set({ ...parsed, modified: new Date() }).where(eq(bisectAccountingStatements.id, id));
  return getBisectAccountingStatements(db, id);
}

/**
 * Delete a Bisect Accounting Statements by ID.
 */
export async function deleteBisectAccountingStatements(db: any, id: string) {
  await db.delete(bisectAccountingStatements).where(eq(bisectAccountingStatements.id, id));
  return { deleted: true, id };
}
