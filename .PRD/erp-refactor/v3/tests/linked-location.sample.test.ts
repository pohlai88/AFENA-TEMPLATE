import { describe, it, expect } from 'vitest';
import { LinkedLocationSchema, LinkedLocationInsertSchema } from '../types/linked-location.js';

describe('LinkedLocation Zod validation', () => {
  const validSample = {
      "id": "TEST-LinkedLocation-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "location": "LINK-location-001"
  };

  it('validates a correct Linked Location object', () => {
    const result = LinkedLocationSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = LinkedLocationInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "location" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).location;
    const result = LinkedLocationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = LinkedLocationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
