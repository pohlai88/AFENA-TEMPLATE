// CRUD API handlers for Bisect Nodes
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { bisectNodes } from '../db/schema.js';
import { BisectNodesSchema, BisectNodesInsertSchema } from '../types/bisect-nodes.js';

export const ROUTE_PREFIX = '/bisect-nodes';

/**
 * List Bisect Nodes records.
 */
export async function listBisectNodes(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(bisectNodes).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Bisect Nodes by ID.
 */
export async function getBisectNodes(db: any, id: string) {
  const rows = await db.select().from(bisectNodes).where(eq(bisectNodes.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Bisect Nodes.
 */
export async function createBisectNodes(db: any, data: unknown) {
  const parsed = BisectNodesInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(bisectNodes).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Bisect Nodes.
 */
export async function updateBisectNodes(db: any, id: string, data: unknown) {
  const parsed = BisectNodesInsertSchema.partial().parse(data);
  await db.update(bisectNodes).set({ ...parsed, modified: new Date() }).where(eq(bisectNodes.id, id));
  return getBisectNodes(db, id);
}

/**
 * Delete a Bisect Nodes by ID.
 */
export async function deleteBisectNodes(db: any, id: string) {
  await db.delete(bisectNodes).where(eq(bisectNodes.id, id));
  return { deleted: true, id };
}
