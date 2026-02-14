import { describe, it, expect } from 'vitest';
import { VariantFieldSchema, VariantFieldInsertSchema } from '../types/variant-field.js';

describe('VariantField Zod validation', () => {
  const validSample = {
      "id": "TEST-VariantField-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "field_name": "Sample Field Name"
  };

  it('validates a correct Variant Field object', () => {
    const result = VariantFieldSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = VariantFieldInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "field_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).field_name;
    const result = VariantFieldSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = VariantFieldSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
