// CRUD API handlers for Appointment Booking Slots
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { appointmentBookingSlots } from '../db/schema.js';
import { AppointmentBookingSlotsSchema, AppointmentBookingSlotsInsertSchema } from '../types/appointment-booking-slots.js';

export const ROUTE_PREFIX = '/appointment-booking-slots';

/**
 * List Appointment Booking Slots records.
 */
export async function listAppointmentBookingSlots(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(appointmentBookingSlots).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Appointment Booking Slots by ID.
 */
export async function getAppointmentBookingSlots(db: any, id: string) {
  const rows = await db.select().from(appointmentBookingSlots).where(eq(appointmentBookingSlots.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Appointment Booking Slots.
 */
export async function createAppointmentBookingSlots(db: any, data: unknown) {
  const parsed = AppointmentBookingSlotsInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(appointmentBookingSlots).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Appointment Booking Slots.
 */
export async function updateAppointmentBookingSlots(db: any, id: string, data: unknown) {
  const parsed = AppointmentBookingSlotsInsertSchema.partial().parse(data);
  await db.update(appointmentBookingSlots).set({ ...parsed, modified: new Date() }).where(eq(appointmentBookingSlots.id, id));
  return getAppointmentBookingSlots(db, id);
}

/**
 * Delete a Appointment Booking Slots by ID.
 */
export async function deleteAppointmentBookingSlots(db: any, id: string) {
  await db.delete(appointmentBookingSlots).where(eq(appointmentBookingSlots.id, id));
  return { deleted: true, id };
}
