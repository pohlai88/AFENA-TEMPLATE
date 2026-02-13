// CRUD API handlers for Department
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { department } from '../db/schema.js';
import { DepartmentSchema, DepartmentInsertSchema } from '../types/department.js';

export const ROUTE_PREFIX = '/department';

/**
 * List Department records.
 */
export async function listDepartment(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(department).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Department by ID.
 */
export async function getDepartment(db: any, id: string) {
  const rows = await db.select().from(department).where(eq(department.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Department.
 */
export async function createDepartment(db: any, data: unknown) {
  const parsed = DepartmentInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(department).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Department.
 */
export async function updateDepartment(db: any, id: string, data: unknown) {
  const parsed = DepartmentInsertSchema.partial().parse(data);
  await db.update(department).set({ ...parsed, modified: new Date() }).where(eq(department.id, id));
  return getDepartment(db, id);
}

/**
 * Delete a Department by ID.
 */
export async function deleteDepartment(db: any, id: string) {
  await db.delete(department).where(eq(department.id, id));
  return { deleted: true, id };
}
