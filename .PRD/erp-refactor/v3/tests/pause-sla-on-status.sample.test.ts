import { describe, it, expect } from 'vitest';
import { PauseSlaOnStatusSchema, PauseSlaOnStatusInsertSchema } from '../types/pause-sla-on-status.js';

describe('PauseSlaOnStatus Zod validation', () => {
  const validSample = {
      "id": "TEST-PauseSlaOnStatus-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "status": "Option1"
  };

  it('validates a correct Pause SLA On Status object', () => {
    const result = PauseSlaOnStatusSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PauseSlaOnStatusInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "status" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).status;
    const result = PauseSlaOnStatusSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PauseSlaOnStatusSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
