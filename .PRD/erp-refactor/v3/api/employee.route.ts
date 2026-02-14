// CRUD API handlers for Employee
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { employee } from '../db/schema.js';
import { EmployeeSchema, EmployeeInsertSchema } from '../types/employee.js';

export const ROUTE_PREFIX = '/employee';

/**
 * List Employee records.
 */
export async function listEmployee(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(employee).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Employee by ID.
 */
export async function getEmployee(db: any, id: string) {
  const rows = await db.select().from(employee).where(eq(employee.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Employee.
 */
export async function createEmployee(db: any, data: unknown) {
  const parsed = EmployeeInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(employee).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Employee.
 */
export async function updateEmployee(db: any, id: string, data: unknown) {
  const parsed = EmployeeInsertSchema.partial().parse(data);
  await db.update(employee).set({ ...parsed, modified: new Date() }).where(eq(employee.id, id));
  return getEmployee(db, id);
}

/**
 * Delete a Employee by ID.
 */
export async function deleteEmployee(db: any, id: string) {
  await db.delete(employee).where(eq(employee.id, id));
  return { deleted: true, id };
}
