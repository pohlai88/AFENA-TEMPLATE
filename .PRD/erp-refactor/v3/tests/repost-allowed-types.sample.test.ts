import { describe, it, expect } from 'vitest';
import { RepostAllowedTypesSchema, RepostAllowedTypesInsertSchema } from '../types/repost-allowed-types.js';

describe('RepostAllowedTypes Zod validation', () => {
  const validSample = {
      "id": "TEST-RepostAllowedTypes-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "document_type": "LINK-document_type-001",
      "allowed": "0"
  };

  it('validates a correct Repost Allowed Types object', () => {
    const result = RepostAllowedTypesSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = RepostAllowedTypesInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = RepostAllowedTypesSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
