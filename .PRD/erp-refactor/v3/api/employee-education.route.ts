// CRUD API handlers for Employee Education
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { employeeEducation } from '../db/schema.js';
import { EmployeeEducationSchema, EmployeeEducationInsertSchema } from '../types/employee-education.js';

export const ROUTE_PREFIX = '/employee-education';

/**
 * List Employee Education records.
 */
export async function listEmployeeEducation(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(employeeEducation).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Employee Education by ID.
 */
export async function getEmployeeEducation(db: any, id: string) {
  const rows = await db.select().from(employeeEducation).where(eq(employeeEducation.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Employee Education.
 */
export async function createEmployeeEducation(db: any, data: unknown) {
  const parsed = EmployeeEducationInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(employeeEducation).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Employee Education.
 */
export async function updateEmployeeEducation(db: any, id: string, data: unknown) {
  const parsed = EmployeeEducationInsertSchema.partial().parse(data);
  await db.update(employeeEducation).set({ ...parsed, modified: new Date() }).where(eq(employeeEducation.id, id));
  return getEmployeeEducation(db, id);
}

/**
 * Delete a Employee Education by ID.
 */
export async function deleteEmployeeEducation(db: any, id: string) {
  await db.delete(employeeEducation).where(eq(employeeEducation.id, id));
  return { deleted: true, id };
}
