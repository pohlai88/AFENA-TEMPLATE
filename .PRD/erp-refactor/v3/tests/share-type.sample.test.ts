import { describe, it, expect } from 'vitest';
import { ShareTypeSchema, ShareTypeInsertSchema } from '../types/share-type.js';

describe('ShareType Zod validation', () => {
  const validSample = {
      "id": "TEST-ShareType-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "title": "Sample Title",
      "description": "Sample text for description"
  };

  it('validates a correct Share Type object', () => {
    const result = ShareTypeSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ShareTypeInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "title" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).title;
    const result = ShareTypeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ShareTypeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
