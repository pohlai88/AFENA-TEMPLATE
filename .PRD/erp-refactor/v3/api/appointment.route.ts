// CRUD API handlers for Appointment
// Generated from Canon schema — do not edit manually

import { eq } from 'drizzle-orm';
import { appointment } from '../db/schema.js';
import { AppointmentSchema, AppointmentInsertSchema } from '../types/appointment.js';

export const ROUTE_PREFIX = '/appointment';

/**
 * List Appointment records.
 */
export async function listAppointment(db: any, params: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = params;
  const rows = await db.select().from(appointment).limit(limit).offset(offset);
  return rows;
}

/**
 * Get a single Appointment by ID.
 */
export async function getAppointment(db: any, id: string) {
  const rows = await db.select().from(appointment).where(eq(appointment.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Create a new Appointment.
 */
export async function createAppointment(db: any, data: unknown) {
  const parsed = AppointmentInsertSchema.parse(data);
  const id = crypto.randomUUID();
  const now = new Date();
  const row = {
    id,
    ...parsed,
    creation: now,
    modified: now,
  };
  await db.insert(appointment).values(row);
  return { id, ...parsed };
}

/**
 * Update an existing Appointment.
 */
export async function updateAppointment(db: any, id: string, data: unknown) {
  const parsed = AppointmentInsertSchema.partial().parse(data);
  await db.update(appointment).set({ ...parsed, modified: new Date() }).where(eq(appointment.id, id));
  return getAppointment(db, id);
}

/**
 * Delete a Appointment by ID.
 */
export async function deleteAppointment(db: any, id: string) {
  await db.delete(appointment).where(eq(appointment.id, id));
  return { deleted: true, id };
}
