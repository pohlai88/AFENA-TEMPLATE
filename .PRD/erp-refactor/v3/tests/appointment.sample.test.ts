import { describe, it, expect } from 'vitest';
import { AppointmentSchema, AppointmentInsertSchema } from '../types/appointment.js';

describe('Appointment Zod validation', () => {
  const validSample = {
      "id": "TEST-Appointment-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "scheduled_time": "2024-01-15T10:30:00.000Z",
      "status": "Open",
      "customer_name": "Sample Name",
      "customer_phone_number": "Sample Phone Number",
      "customer_skype": "Sample Skype ID",
      "customer_email": "Sample Email",
      "customer_details": "Sample text for customer_details",
      "appointment_with": "LINK-appointment_with-001",
      "party": "LINK-party-001",
      "calendar_event": "LINK-calendar_event-001"
  };

  it('validates a correct Appointment object', () => {
    const result = AppointmentSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = AppointmentInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "scheduled_time" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).scheduled_time;
    const result = AppointmentSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = AppointmentSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
