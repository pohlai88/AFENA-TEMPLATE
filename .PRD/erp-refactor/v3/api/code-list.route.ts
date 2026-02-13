// CRUD API handlers for Code List
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { codeList } from '../db/schema.js';
import { CodeListSchema, CodeListInsertSchema } from '../types/code-list.js';

export const ROUTE_PREFIX = '/code-list';

/**
 * List Code List records.
 */
export async function listCodeList(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(codeList).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Code List by ID.
 */
export async function getCodeList(db: any, id: string) {
  const rows = await db.select().from(codeList).where(eq(codeList.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Code List.
 */
export async function createCodeList(db: any, data: unknown) {
  const parsed = CodeListInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(codeList).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Code List.
 */
export async function updateCodeList(db: any, id: string, data: unknown) {
  const parsed = CodeListInsertSchema.partial().parse(data);
  await db.update(codeList).set({ ...parsed, modified: new Date() }).where(eq(codeList.id, id));
  return getCodeList(db, id);
}

/**
 * Delete a Code List by ID.
 */
export async function deleteCodeList(db: any, id: string) {
  await db.delete(codeList).where(eq(codeList.id, id));
  return { deleted: true, id };
}
