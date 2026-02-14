// CRUD API handlers for Employee Group
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { employeeGroup } from '../db/schema.js';
import { EmployeeGroupSchema, EmployeeGroupInsertSchema } from '../types/employee-group.js';

export const ROUTE_PREFIX = '/employee-group';

/**
 * List Employee Group records.
 */
export async function listEmployeeGroup(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(employeeGroup).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Employee Group by ID.
 */
export async function getEmployeeGroup(db: any, id: string) {
  const rows = await db.select().from(employeeGroup).where(eq(employeeGroup.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Employee Group.
 */
export async function createEmployeeGroup(db: any, data: unknown) {
  const parsed = EmployeeGroupInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(employeeGroup).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Employee Group.
 */
export async function updateEmployeeGroup(db: any, id: string, data: unknown) {
  const parsed = EmployeeGroupInsertSchema.partial().parse(data);
  await db.update(employeeGroup).set({ ...parsed, modified: new Date() }).where(eq(employeeGroup.id, id));
  return getEmployeeGroup(db, id);
}

/**
 * Delete a Employee Group by ID.
 */
export async function deleteEmployeeGroup(db: any, id: string) {
  await db.delete(employeeGroup).where(eq(employeeGroup.id, id));
  return { deleted: true, id };
}
