import { describe, it, expect } from 'vitest';
import { IndustryTypeSchema, IndustryTypeInsertSchema } from '../types/industry-type.js';

describe('IndustryType Zod validation', () => {
  const validSample = {
      "id": "TEST-IndustryType-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "industry": "Sample Industry"
  };

  it('validates a correct Industry Type object', () => {
    const result = IndustryTypeSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = IndustryTypeInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "industry" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).industry;
    const result = IndustryTypeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = IndustryTypeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
