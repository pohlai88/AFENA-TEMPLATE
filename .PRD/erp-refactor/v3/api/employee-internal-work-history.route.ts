// CRUD API handlers for Employee Internal Work History
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { employeeInternalWorkHistory } from '../db/schema.js';
import { EmployeeInternalWorkHistorySchema, EmployeeInternalWorkHistoryInsertSchema } from '../types/employee-internal-work-history.js';

export const ROUTE_PREFIX = '/employee-internal-work-history';

/**
 * List Employee Internal Work History records.
 */
export async function listEmployeeInternalWorkHistory(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(employeeInternalWorkHistory).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Employee Internal Work History by ID.
 */
export async function getEmployeeInternalWorkHistory(db: any, id: string) {
  const rows = await db.select().from(employeeInternalWorkHistory).where(eq(employeeInternalWorkHistory.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Employee Internal Work History.
 */
export async function createEmployeeInternalWorkHistory(db: any, data: unknown) {
  const parsed = EmployeeInternalWorkHistoryInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(employeeInternalWorkHistory).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Employee Internal Work History.
 */
export async function updateEmployeeInternalWorkHistory(db: any, id: string, data: unknown) {
  const parsed = EmployeeInternalWorkHistoryInsertSchema.partial().parse(data);
  await db.update(employeeInternalWorkHistory).set({ ...parsed, modified: new Date() }).where(eq(employeeInternalWorkHistory.id, id));
  return getEmployeeInternalWorkHistory(db, id);
}

/**
 * Delete a Employee Internal Work History by ID.
 */
export async function deleteEmployeeInternalWorkHistory(db: any, id: string) {
  await db.delete(employeeInternalWorkHistory).where(eq(employeeInternalWorkHistory.id, id));
  return { deleted: true, id };
}
