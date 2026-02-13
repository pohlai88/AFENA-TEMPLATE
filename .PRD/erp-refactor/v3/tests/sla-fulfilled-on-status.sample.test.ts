import { describe, it, expect } from 'vitest';
import { SlaFulfilledOnStatusSchema, SlaFulfilledOnStatusInsertSchema } from '../types/sla-fulfilled-on-status.js';

describe('SlaFulfilledOnStatus Zod validation', () => {
  const validSample = {
      "id": "TEST-SlaFulfilledOnStatus-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "status": "Option1"
  };

  it('validates a correct SLA Fulfilled On Status object', () => {
    const result = SlaFulfilledOnStatusSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SlaFulfilledOnStatusInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "status" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).status;
    const result = SlaFulfilledOnStatusSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SlaFulfilledOnStatusSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
