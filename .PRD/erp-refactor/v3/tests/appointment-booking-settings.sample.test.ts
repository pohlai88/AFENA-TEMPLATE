import { describe, it, expect } from 'vitest';
import { AppointmentBookingSettingsSchema, AppointmentBookingSettingsInsertSchema } from '../types/appointment-booking-settings.js';

describe('AppointmentBookingSettings Zod validation', () => {
  const validSample = {
      "id": "TEST-AppointmentBookingSettings-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "enable_scheduling": "0",
      "number_of_agents": "1",
      "holiday_list": "LINK-holiday_list-001",
      "appointment_duration": "60",
      "email_reminders": "0",
      "advance_booking_days": "7",
      "success_redirect_url": "Sample Success Redirect URL"
  };

  it('validates a correct Appointment Booking Settings object', () => {
    const result = AppointmentBookingSettingsSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = AppointmentBookingSettingsInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "enable_scheduling" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).enable_scheduling;
    const result = AppointmentBookingSettingsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = AppointmentBookingSettingsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
