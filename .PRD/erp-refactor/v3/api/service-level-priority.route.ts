// CRUD API handlers for Service Level Priority
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { serviceLevelPriority } from '../db/schema.js';
import { ServiceLevelPrioritySchema, ServiceLevelPriorityInsertSchema } from '../types/service-level-priority.js';

export const ROUTE_PREFIX = '/service-level-priority';

/**
 * List Service Level Priority records.
 */
export async function listServiceLevelPriority(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(serviceLevelPriority).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Service Level Priority by ID.
 */
export async function getServiceLevelPriority(db: any, id: string) {
  const rows = await db.select().from(serviceLevelPriority).where(eq(serviceLevelPriority.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Service Level Priority.
 */
export async function createServiceLevelPriority(db: any, data: unknown) {
  const parsed = ServiceLevelPriorityInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(serviceLevelPriority).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Service Level Priority.
 */
export async function updateServiceLevelPriority(db: any, id: string, data: unknown) {
  const parsed = ServiceLevelPriorityInsertSchema.partial().parse(data);
  await db.update(serviceLevelPriority).set({ ...parsed, modified: new Date() }).where(eq(serviceLevelPriority.id, id));
  return getServiceLevelPriority(db, id);
}

/**
 * Delete a Service Level Priority by ID.
 */
export async function deleteServiceLevelPriority(db: any, id: string) {
  await db.delete(serviceLevelPriority).where(eq(serviceLevelPriority.id, id));
  return { deleted: true, id };
}
