import { describe, it, expect } from 'vitest';
import { UomConversionFactorSchema, UomConversionFactorInsertSchema } from '../types/uom-conversion-factor.js';

describe('UomConversionFactor Zod validation', () => {
  const validSample = {
      "id": "TEST-UomConversionFactor-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "category": "LINK-category-001",
      "from_uom": "LINK-from_uom-001",
      "to_uom": "LINK-to_uom-001",
      "value": 1
  };

  it('validates a correct UOM Conversion Factor object', () => {
    const result = UomConversionFactorSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = UomConversionFactorInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "category" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).category;
    const result = UomConversionFactorSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = UomConversionFactorSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
