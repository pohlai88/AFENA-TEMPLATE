import { describe, it, expect } from 'vitest';
import { DeliveryStopSchema, DeliveryStopInsertSchema } from '../types/delivery-stop.js';

describe('DeliveryStop Zod validation', () => {
  const validSample = {
      "id": "TEST-DeliveryStop-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "customer": "LINK-customer-001",
      "address": "LINK-address-001",
      "locked": "0",
      "customer_address": "Sample text for customer_address",
      "visited": "0",
      "delivery_note": "LINK-delivery_note-001",
      "grand_total": 100,
      "contact": "LINK-contact-001",
      "email_sent_to": "Sample Email sent to",
      "customer_contact": "Sample text for customer_contact",
      "distance": 1,
      "estimated_arrival": "2024-01-15T10:30:00.000Z",
      "lat": 1,
      "uom": "LINK-uom-001",
      "lng": 1,
      "details": "Sample text for details"
  };

  it('validates a correct Delivery Stop object', () => {
    const result = DeliveryStopSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = DeliveryStopInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "address" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).address;
    const result = DeliveryStopSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = DeliveryStopSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
