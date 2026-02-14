import { describe, it, expect } from 'vitest';
import { IncotermSchema, IncotermInsertSchema } from '../types/incoterm.js';

describe('Incoterm Zod validation', () => {
  const validSample = {
      "id": "TEST-Incoterm-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "code": "Sample Code",
      "title": "Sample Title",
      "description": "Sample text for description"
  };

  it('validates a correct Incoterm object', () => {
    const result = IncotermSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = IncotermInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "code" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).code;
    const result = IncotermSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = IncotermSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
