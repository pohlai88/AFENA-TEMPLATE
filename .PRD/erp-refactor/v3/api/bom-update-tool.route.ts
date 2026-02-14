// CRUD API handlers for BOM Update Tool
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { bomUpdateTool } from '../db/schema.js';
import { BomUpdateToolSchema, BomUpdateToolInsertSchema } from '../types/bom-update-tool.js';

export const ROUTE_PREFIX = '/bom-update-tool';

/**
 * List BOM Update Tool records.
 */
export async function listBomUpdateTool(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(bomUpdateTool).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single BOM Update Tool by ID.
 */
export async function getBomUpdateTool(db: any, id: string) {
  const rows = await db.select().from(bomUpdateTool).where(eq(bomUpdateTool.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new BOM Update Tool.
 */
export async function createBomUpdateTool(db: any, data: unknown) {
  const parsed = BomUpdateToolInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(bomUpdateTool).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing BOM Update Tool.
 */
export async function updateBomUpdateTool(db: any, id: string, data: unknown) {
  const parsed = BomUpdateToolInsertSchema.partial().parse(data);
  await db.update(bomUpdateTool).set({ ...parsed, modified: new Date() }).where(eq(bomUpdateTool.id, id));
  return getBomUpdateTool(db, id);
}

/**
 * Delete a BOM Update Tool by ID.
 */
export async function deleteBomUpdateTool(db: any, id: string) {
  await db.delete(bomUpdateTool).where(eq(bomUpdateTool.id, id));
  return { deleted: true, id };
}
