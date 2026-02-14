// CRUD API handlers for Availability Of Slots
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { availabilityOfSlots } from '../db/schema.js';
import { AvailabilityOfSlotsSchema, AvailabilityOfSlotsInsertSchema } from '../types/availability-of-slots.js';

export const ROUTE_PREFIX = '/availability-of-slots';

/**
 * List Availability Of Slots records.
 */
export async function listAvailabilityOfSlots(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(availabilityOfSlots).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Availability Of Slots by ID.
 */
export async function getAvailabilityOfSlots(db: any, id: string) {
  const rows = await db.select().from(availabilityOfSlots).where(eq(availabilityOfSlots.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Availability Of Slots.
 */
export async function createAvailabilityOfSlots(db: any, data: unknown) {
  const parsed = AvailabilityOfSlotsInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(availabilityOfSlots).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Availability Of Slots.
 */
export async function updateAvailabilityOfSlots(db: any, id: string, data: unknown) {
  const parsed = AvailabilityOfSlotsInsertSchema.partial().parse(data);
  await db.update(availabilityOfSlots).set({ ...parsed, modified: new Date() }).where(eq(availabilityOfSlots.id, id));
  return getAvailabilityOfSlots(db, id);
}

/**
 * Delete a Availability Of Slots by ID.
 */
export async function deleteAvailabilityOfSlots(db: any, id: string) {
  await db.delete(availabilityOfSlots).where(eq(availabilityOfSlots.id, id));
  return { deleted: true, id };
}
