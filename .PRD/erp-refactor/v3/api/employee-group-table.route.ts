// CRUD API handlers for Employee Group Table
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { employeeGroupTable } from '../db/schema.js';
import { EmployeeGroupTableSchema, EmployeeGroupTableInsertSchema } from '../types/employee-group-table.js';

export const ROUTE_PREFIX = '/employee-group-table';

/**
 * List Employee Group Table records.
 */
export async function listEmployeeGroupTable(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(employeeGroupTable).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Employee Group Table by ID.
 */
export async function getEmployeeGroupTable(db: any, id: string) {
  const rows = await db.select().from(employeeGroupTable).where(eq(employeeGroupTable.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Employee Group Table.
 */
export async function createEmployeeGroupTable(db: any, data: unknown) {
  const parsed = EmployeeGroupTableInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(employeeGroupTable).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Employee Group Table.
 */
export async function updateEmployeeGroupTable(db: any, id: string, data: unknown) {
  const parsed = EmployeeGroupTableInsertSchema.partial().parse(data);
  await db.update(employeeGroupTable).set({ ...parsed, modified: new Date() }).where(eq(employeeGroupTable.id, id));
  return getEmployeeGroupTable(db, id);
}

/**
 * Delete a Employee Group Table by ID.
 */
export async function deleteEmployeeGroupTable(db: any, id: string) {
  await db.delete(employeeGroupTable).where(eq(employeeGroupTable.id, id));
  return { deleted: true, id };
}
