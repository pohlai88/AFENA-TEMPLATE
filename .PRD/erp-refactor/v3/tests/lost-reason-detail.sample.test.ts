import { describe, it, expect } from 'vitest';
import { LostReasonDetailSchema, LostReasonDetailInsertSchema } from '../types/lost-reason-detail.js';

describe('LostReasonDetail Zod validation', () => {
  const validSample = {
      "id": "TEST-LostReasonDetail-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "lost_reason": "LINK-lost_reason-001"
  };

  it('validates a correct Lost Reason Detail object', () => {
    const result = LostReasonDetailSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = LostReasonDetailInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = LostReasonDetailSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
