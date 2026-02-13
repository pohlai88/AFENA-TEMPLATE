// CRUD API handlers for Employee External Work History
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { employeeExternalWorkHistory } from '../db/schema.js';
import { EmployeeExternalWorkHistorySchema, EmployeeExternalWorkHistoryInsertSchema } from '../types/employee-external-work-history.js';

export const ROUTE_PREFIX = '/employee-external-work-history';

/**
 * List Employee External Work History records.
 */
export async function listEmployeeExternalWorkHistory(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(employeeExternalWorkHistory).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Employee External Work History by ID.
 */
export async function getEmployeeExternalWorkHistory(db: any, id: string) {
  const rows = await db.select().from(employeeExternalWorkHistory).where(eq(employeeExternalWorkHistory.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Employee External Work History.
 */
export async function createEmployeeExternalWorkHistory(db: any, data: unknown) {
  const parsed = EmployeeExternalWorkHistoryInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(employeeExternalWorkHistory).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Employee External Work History.
 */
export async function updateEmployeeExternalWorkHistory(db: any, id: string, data: unknown) {
  const parsed = EmployeeExternalWorkHistoryInsertSchema.partial().parse(data);
  await db.update(employeeExternalWorkHistory).set({ ...parsed, modified: new Date() }).where(eq(employeeExternalWorkHistory.id, id));
  return getEmployeeExternalWorkHistory(db, id);
}

/**
 * Delete a Employee External Work History by ID.
 */
export async function deleteEmployeeExternalWorkHistory(db: any, id: string) {
  await db.delete(employeeExternalWorkHistory).where(eq(employeeExternalWorkHistory.id, id));
  return { deleted: true, id };
}
