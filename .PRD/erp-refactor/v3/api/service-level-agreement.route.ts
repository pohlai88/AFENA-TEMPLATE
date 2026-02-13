// CRUD API handlers for Service Level Agreement
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { serviceLevelAgreement } from '../db/schema.js';
import { ServiceLevelAgreementSchema, ServiceLevelAgreementInsertSchema } from '../types/service-level-agreement.js';

export const ROUTE_PREFIX = '/service-level-agreement';

/**
 * List Service Level Agreement records.
 */
export async function listServiceLevelAgreement(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(serviceLevelAgreement).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Service Level Agreement by ID.
 */
export async function getServiceLevelAgreement(db: any, id: string) {
  const rows = await db.select().from(serviceLevelAgreement).where(eq(serviceLevelAgreement.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Service Level Agreement.
 */
export async function createServiceLevelAgreement(db: any, data: unknown) {
  const parsed = ServiceLevelAgreementInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(serviceLevelAgreement).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Service Level Agreement.
 */
export async function updateServiceLevelAgreement(db: any, id: string, data: unknown) {
  const parsed = ServiceLevelAgreementInsertSchema.partial().parse(data);
  await db.update(serviceLevelAgreement).set({ ...parsed, modified: new Date() }).where(eq(serviceLevelAgreement.id, id));
  return getServiceLevelAgreement(db, id);
}

/**
 * Delete a Service Level Agreement by ID.
 */
export async function deleteServiceLevelAgreement(db: any, id: string) {
  await db.delete(serviceLevelAgreement).where(eq(serviceLevelAgreement.id, id));
  return { deleted: true, id };
}
