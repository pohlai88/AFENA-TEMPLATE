import { describe, it, expect } from 'vitest';
import { ManufacturerSchema, ManufacturerInsertSchema } from '../types/manufacturer.js';

describe('Manufacturer Zod validation', () => {
  const validSample = {
      "id": "TEST-Manufacturer-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "short_name": "Sample Short Name",
      "full_name": "Sample Full Name",
      "website": "Sample Website",
      "country": "LINK-country-001",
      "logo": "/files/sample.png",
      "address_html": "Sample text for address_html",
      "contact_html": "Sample text for contact_html",
      "notes": "Sample text for notes"
  };

  it('validates a correct Manufacturer object', () => {
    const result = ManufacturerSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ManufacturerInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "short_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).short_name;
    const result = ManufacturerSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ManufacturerSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
