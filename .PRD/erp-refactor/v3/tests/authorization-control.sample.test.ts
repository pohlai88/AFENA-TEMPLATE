import { describe, it, expect } from 'vitest';
import { AuthorizationControlSchema, AuthorizationControlInsertSchema } from '../types/authorization-control.js';

describe('AuthorizationControl Zod validation', () => {
  const validSample = {
      "id": "TEST-AuthorizationControl-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator"
  };

  it('validates a correct Authorization Control object', () => {
    const result = AuthorizationControlSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = AuthorizationControlInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = AuthorizationControlSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
