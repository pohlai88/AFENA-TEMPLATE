import { describe, it, expect } from 'vitest';
import { UomConversionDetailSchema, UomConversionDetailInsertSchema } from '../types/uom-conversion-detail.js';

describe('UomConversionDetail Zod validation', () => {
  const validSample = {
      "id": "TEST-UomConversionDetail-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "uom": "LINK-uom-001",
      "conversion_factor": 1
  };

  it('validates a correct UOM Conversion Detail object', () => {
    const result = UomConversionDetailSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = UomConversionDetailInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = UomConversionDetailSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
