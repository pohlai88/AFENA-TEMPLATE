import { describe, it, expect } from 'vitest';
import { PosFieldSchema, PosFieldInsertSchema } from '../types/pos-field.js';

describe('PosField Zod validation', () => {
  const validSample = {
      "id": "TEST-PosField-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "fieldname": "Option1",
      "label": "Sample Label",
      "fieldtype": "Sample Fieldtype",
      "options": "Sample text for options",
      "default_value": "Sample Default Value",
      "reqd": "0",
      "read_only": "0"
  };

  it('validates a correct POS Field object', () => {
    const result = PosFieldSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PosFieldInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PosFieldSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
