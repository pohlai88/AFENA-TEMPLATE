import { desc, sql } from 'drizzle-orm';
import { check, index, pgTable, primaryKey, unique } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Appointment Booking Settings — configuration for appointment scheduling.
 * Source: appointment-booking-settings.spec.json (adopted from ERPNext Appointment Booking Settings).
 * Singleton config entity for appointment booking system.
 */
export const appointmentBookingSettings = pgTable(
  'appointment_booking_settings',
  {
    ...erpEntityColumns,
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    unique('appointment_booking_settings_org_singleton').on(table.orgId),
    index('appointment_booking_settings_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    check('appointment_booking_settings_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type AppointmentBookingSettings = typeof appointmentBookingSettings.$inferSelect;
export type NewAppointmentBookingSettings = typeof appointmentBookingSettings.$inferInsert;
