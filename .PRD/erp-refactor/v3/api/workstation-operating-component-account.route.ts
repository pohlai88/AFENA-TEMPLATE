// CRUD API handlers for Workstation Operating Component Account
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { workstationOperatingComponentAccount } from '../db/schema.js';
import { WorkstationOperatingComponentAccountSchema, WorkstationOperatingComponentAccountInsertSchema } from '../types/workstation-operating-component-account.js';

export const ROUTE_PREFIX = '/workstation-operating-component-account';

/**
 * List Workstation Operating Component Account records.
 */
export async function listWorkstationOperatingComponentAccount(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(workstationOperatingComponentAccount).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Workstation Operating Component Account by ID.
 */
export async function getWorkstationOperatingComponentAccount(db: any, id: string) {
  const rows = await db.select().from(workstationOperatingComponentAccount).where(eq(workstationOperatingComponentAccount.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Workstation Operating Component Account.
 */
export async function createWorkstationOperatingComponentAccount(db: any, data: unknown) {
  const parsed = WorkstationOperatingComponentAccountInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(workstationOperatingComponentAccount).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Workstation Operating Component Account.
 */
export async function updateWorkstationOperatingComponentAccount(db: any, id: string, data: unknown) {
  const parsed = WorkstationOperatingComponentAccountInsertSchema.partial().parse(data);
  await db.update(workstationOperatingComponentAccount).set({ ...parsed, modified: new Date() }).where(eq(workstationOperatingComponentAccount.id, id));
  return getWorkstationOperatingComponentAccount(db, id);
}

/**
 * Delete a Workstation Operating Component Account by ID.
 */
export async function deleteWorkstationOperatingComponentAccount(db: any, id: string) {
  await db.delete(workstationOperatingComponentAccount).where(eq(workstationOperatingComponentAccount.id, id));
  return { deleted: true, id };
}
