import { describe, it, expect } from 'vitest';
import { PosSearchFieldsSchema, PosSearchFieldsInsertSchema } from '../types/pos-search-fields.js';

describe('PosSearchFields Zod validation', () => {
  const validSample = {
      "id": "TEST-PosSearchFields-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "field": "Option1",
      "fieldname": "Sample Fieldname"
  };

  it('validates a correct POS Search Fields object', () => {
    const result = PosSearchFieldsSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PosSearchFieldsInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "field" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).field;
    const result = PosSearchFieldsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PosSearchFieldsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
