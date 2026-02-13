import { describe, it, expect } from 'vitest';
import { ShipmentDeliveryNoteSchema, ShipmentDeliveryNoteInsertSchema } from '../types/shipment-delivery-note.js';

describe('ShipmentDeliveryNote Zod validation', () => {
  const validSample = {
      "id": "TEST-ShipmentDeliveryNote-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "delivery_note": "LINK-delivery_note-001",
      "grand_total": 100
  };

  it('validates a correct Shipment Delivery Note object', () => {
    const result = ShipmentDeliveryNoteSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ShipmentDeliveryNoteInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "delivery_note" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).delivery_note;
    const result = ShipmentDeliveryNoteSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ShipmentDeliveryNoteSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
