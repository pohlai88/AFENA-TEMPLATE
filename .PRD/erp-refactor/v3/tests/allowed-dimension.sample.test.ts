import { describe, it, expect } from 'vitest';
import { AllowedDimensionSchema, AllowedDimensionInsertSchema } from '../types/allowed-dimension.js';

describe('AllowedDimension Zod validation', () => {
  const validSample = {
      "id": "TEST-AllowedDimension-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "accounting_dimension": "LINK-accounting_dimension-001",
      "dimension_value": "LINK-dimension_value-001"
  };

  it('validates a correct Allowed Dimension object', () => {
    const result = AllowedDimensionSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = AllowedDimensionInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = AllowedDimensionSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
