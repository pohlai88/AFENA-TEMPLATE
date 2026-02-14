import { describe, it, expect } from 'vitest';
import { DesignationSchema, DesignationInsertSchema } from '../types/designation.js';

describe('Designation Zod validation', () => {
  const validSample = {
      "id": "TEST-Designation-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "designation_name": "Sample Designation",
      "description": "Sample text for description"
  };

  it('validates a correct Designation object', () => {
    const result = DesignationSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = DesignationInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "designation_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).designation_name;
    const result = DesignationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = DesignationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
