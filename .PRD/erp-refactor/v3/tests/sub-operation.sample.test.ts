import { describe, it, expect } from 'vitest';
import { SubOperationSchema, SubOperationInsertSchema } from '../types/sub-operation.js';

describe('SubOperation Zod validation', () => {
  const validSample = {
      "id": "TEST-SubOperation-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "operation": "LINK-operation-001",
      "time_in_mins": "0",
      "description": "Sample text for description"
  };

  it('validates a correct Sub Operation object', () => {
    const result = SubOperationSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SubOperationInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SubOperationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
