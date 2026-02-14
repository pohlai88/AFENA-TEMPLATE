import { describe, it, expect } from 'vitest';
import { UomSchema, UomInsertSchema } from '../types/uom.js';

describe('Uom Zod validation', () => {
  const validSample = {
      "id": "TEST-Uom-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "uom_name": "Sample UOM Name",
      "symbol": "Sample Symbol",
      "common_code": "Sample Common Code",
      "description": "Sample text for description",
      "enabled": "1",
      "must_be_whole_number": "0"
  };

  it('validates a correct UOM object', () => {
    const result = UomSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = UomInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "uom_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).uom_name;
    const result = UomSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = UomSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
