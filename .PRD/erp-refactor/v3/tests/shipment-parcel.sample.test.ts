import { describe, it, expect } from 'vitest';
import { ShipmentParcelSchema, ShipmentParcelInsertSchema } from '../types/shipment-parcel.js';

describe('ShipmentParcel Zod validation', () => {
  const validSample = {
      "id": "TEST-ShipmentParcel-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "length": 1,
      "width": 1,
      "height": 1,
      "weight": 1,
      "count": "1"
  };

  it('validates a correct Shipment Parcel object', () => {
    const result = ShipmentParcelSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ShipmentParcelInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "weight" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).weight;
    const result = ShipmentParcelSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ShipmentParcelSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
