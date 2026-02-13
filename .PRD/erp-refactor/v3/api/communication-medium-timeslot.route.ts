// CRUD API handlers for Communication Medium Timeslot
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { communicationMediumTimeslot } from '../db/schema.js';
import { CommunicationMediumTimeslotSchema, CommunicationMediumTimeslotInsertSchema } from '../types/communication-medium-timeslot.js';

export const ROUTE_PREFIX = '/communication-medium-timeslot';

/**
 * List Communication Medium Timeslot records.
 */
export async function listCommunicationMediumTimeslot(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(communicationMediumTimeslot).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Communication Medium Timeslot by ID.
 */
export async function getCommunicationMediumTimeslot(db: any, id: string) {
  const rows = await db.select().from(communicationMediumTimeslot).where(eq(communicationMediumTimeslot.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Communication Medium Timeslot.
 */
export async function createCommunicationMediumTimeslot(db: any, data: unknown) {
  const parsed = CommunicationMediumTimeslotInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(communicationMediumTimeslot).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Communication Medium Timeslot.
 */
export async function updateCommunicationMediumTimeslot(db: any, id: string, data: unknown) {
  const parsed = CommunicationMediumTimeslotInsertSchema.partial().parse(data);
  await db.update(communicationMediumTimeslot).set({ ...parsed, modified: new Date() }).where(eq(communicationMediumTimeslot.id, id));
  return getCommunicationMediumTimeslot(db, id);
}

/**
 * Delete a Communication Medium Timeslot by ID.
 */
export async function deleteCommunicationMediumTimeslot(db: any, id: string) {
  await db.delete(communicationMediumTimeslot).where(eq(communicationMediumTimeslot.id, id));
  return { deleted: true, id };
}
