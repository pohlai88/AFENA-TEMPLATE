// CRUD API handlers for Appointment Booking Settings
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { appointmentBookingSettings } from '../db/schema.js';
import { AppointmentBookingSettingsSchema, AppointmentBookingSettingsInsertSchema } from '../types/appointment-booking-settings.js';

export const ROUTE_PREFIX = '/appointment-booking-settings';

/**
 * List Appointment Booking Settings records.
 */
export async function listAppointmentBookingSettings(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(appointmentBookingSettings).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Appointment Booking Settings by ID.
 */
export async function getAppointmentBookingSettings(db: any, id: string) {
  const rows = await db.select().from(appointmentBookingSettings).where(eq(appointmentBookingSettings.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Appointment Booking Settings.
 */
export async function createAppointmentBookingSettings(db: any, data: unknown) {
  const parsed = AppointmentBookingSettingsInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(appointmentBookingSettings).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Appointment Booking Settings.
 */
export async function updateAppointmentBookingSettings(db: any, id: string, data: unknown) {
  const parsed = AppointmentBookingSettingsInsertSchema.partial().parse(data);
  await db.update(appointmentBookingSettings).set({ ...parsed, modified: new Date() }).where(eq(appointmentBookingSettings.id, id));
  return getAppointmentBookingSettings(db, id);
}

/**
 * Delete a Appointment Booking Settings by ID.
 */
export async function deleteAppointmentBookingSettings(db: any, id: string) {
  await db.delete(appointmentBookingSettings).where(eq(appointmentBookingSettings.id, id));
  return { deleted: true, id };
}
