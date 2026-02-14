// CRUD API handlers for Communication Medium
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { communicationMedium } from '../db/schema.js';
import { CommunicationMediumSchema, CommunicationMediumInsertSchema } from '../types/communication-medium.js';

export const ROUTE_PREFIX = '/communication-medium';

/**
 * List Communication Medium records.
 */
export async function listCommunicationMedium(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(communicationMedium).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Communication Medium by ID.
 */
export async function getCommunicationMedium(db: any, id: string) {
  const rows = await db.select().from(communicationMedium).where(eq(communicationMedium.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Communication Medium.
 */
export async function createCommunicationMedium(db: any, data: unknown) {
  const parsed = CommunicationMediumInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(communicationMedium).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Communication Medium.
 */
export async function updateCommunicationMedium(db: any, id: string, data: unknown) {
  const parsed = CommunicationMediumInsertSchema.partial().parse(data);
  await db.update(communicationMedium).set({ ...parsed, modified: new Date() }).where(eq(communicationMedium.id, id));
  return getCommunicationMedium(db, id);
}

/**
 * Delete a Communication Medium by ID.
 */
export async function deleteCommunicationMedium(db: any, id: string) {
  await db.delete(communicationMedium).where(eq(communicationMedium.id, id));
  return { deleted: true, id };
}
