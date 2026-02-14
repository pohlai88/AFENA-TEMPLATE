import { describe, it, expect } from 'vitest';
import { BrandSchema, BrandInsertSchema } from '../types/brand.js';

describe('Brand Zod validation', () => {
  const validSample = {
      "id": "TEST-Brand-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "brand": "Sample Brand Name",
      "image": "/files/sample.png",
      "description": "Sample text for description"
  };

  it('validates a correct Brand object', () => {
    const result = BrandSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = BrandInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "brand" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).brand;
    const result = BrandSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = BrandSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
