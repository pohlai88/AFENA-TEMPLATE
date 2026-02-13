import { describe, it, expect } from 'vitest';
import { ShipmentParcelTemplateSchema, ShipmentParcelTemplateInsertSchema } from '../types/shipment-parcel-template.js';

describe('ShipmentParcelTemplate Zod validation', () => {
  const validSample = {
      "id": "TEST-ShipmentParcelTemplate-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "parcel_template_name": "Sample Parcel Template Name",
      "length": 1,
      "width": 1,
      "height": 1,
      "weight": 1
  };

  it('validates a correct Shipment Parcel Template object', () => {
    const result = ShipmentParcelTemplateSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ShipmentParcelTemplateInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "parcel_template_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).parcel_template_name;
    const result = ShipmentParcelTemplateSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ShipmentParcelTemplateSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
