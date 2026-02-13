// CRUD API handlers for Rename Tool
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { renameTool } from '../db/schema.js';
import { RenameToolSchema, RenameToolInsertSchema } from '../types/rename-tool.js';

export const ROUTE_PREFIX = '/rename-tool';

/**
 * List Rename Tool records.
 */
export async function listRenameTool(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(renameTool).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Rename Tool by ID.
 */
export async function getRenameTool(db: any, id: string) {
  const rows = await db.select().from(renameTool).where(eq(renameTool.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Rename Tool.
 */
export async function createRenameTool(db: any, data: unknown) {
  const parsed = RenameToolInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(renameTool).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Rename Tool.
 */
export async function updateRenameTool(db: any, id: string, data: unknown) {
  const parsed = RenameToolInsertSchema.partial().parse(data);
  await db.update(renameTool).set({ ...parsed, modified: new Date() }).where(eq(renameTool.id, id));
  return getRenameTool(db, id);
}

/**
 * Delete a Rename Tool by ID.
 */
export async function deleteRenameTool(db: any, id: string) {
  await db.delete(renameTool).where(eq(renameTool.id, id));
  return { deleted: true, id };
}
