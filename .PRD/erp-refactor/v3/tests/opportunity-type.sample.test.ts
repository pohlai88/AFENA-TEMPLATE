import { describe, it, expect } from 'vitest';
import { OpportunityTypeSchema, OpportunityTypeInsertSchema } from '../types/opportunity-type.js';

describe('OpportunityType Zod validation', () => {
  const validSample = {
      "id": "TEST-OpportunityType-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "description": "Sample text for description"
  };

  it('validates a correct Opportunity Type object', () => {
    const result = OpportunityTypeSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = OpportunityTypeInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = OpportunityTypeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
