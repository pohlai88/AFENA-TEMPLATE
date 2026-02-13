// CRUD API handlers for Sales Team
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { salesTeam } from '../db/schema.js';
import { SalesTeamSchema, SalesTeamInsertSchema } from '../types/sales-team.js';

export const ROUTE_PREFIX = '/sales-team';

/**
 * List Sales Team records.
 */
export async function listSalesTeam(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(salesTeam).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Sales Team by ID.
 */
export async function getSalesTeam(db: any, id: string) {
  const rows = await db.select().from(salesTeam).where(eq(salesTeam.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Sales Team.
 */
export async function createSalesTeam(db: any, data: unknown) {
  const parsed = SalesTeamInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(salesTeam).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Sales Team.
 */
export async function updateSalesTeam(db: any, id: string, data: unknown) {
  const parsed = SalesTeamInsertSchema.partial().parse(data);
  await db.update(salesTeam).set({ ...parsed, modified: new Date() }).where(eq(salesTeam.id, id));
  return getSalesTeam(db, id);
}

/**
 * Delete a Sales Team by ID.
 */
export async function deleteSalesTeam(db: any, id: string) {
  await db.delete(salesTeam).where(eq(salesTeam.id, id));
  return { deleted: true, id };
}
