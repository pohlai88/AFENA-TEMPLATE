import { describe, it, expect } from 'vitest';
import { DeliveryTripSchema, DeliveryTripInsertSchema } from '../types/delivery-trip.js';

describe('DeliveryTrip Zod validation', () => {
  const validSample = {
      "id": "TEST-DeliveryTrip-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "naming_series": "Option1",
      "company": "LINK-company-001",
      "email_notification_sent": "0",
      "driver": "LINK-driver-001",
      "driver_name": "Sample Driver Name",
      "driver_email": "Sample Driver Email",
      "driver_address": "LINK-driver_address-001",
      "total_distance": 1,
      "uom": "LINK-uom-001",
      "vehicle": "LINK-vehicle-001",
      "departure_time": "2024-01-15T10:30:00.000Z",
      "employee": "LINK-employee-001",
      "status": "Draft",
      "amended_from": "LINK-amended_from-001"
  };

  it('validates a correct Delivery Trip object', () => {
    const result = DeliveryTripSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = DeliveryTripInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "company" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).company;
    const result = DeliveryTripSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = DeliveryTripSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
