import { describe, it, expect } from 'vitest';
import { OpportunityLostReasonSchema, OpportunityLostReasonInsertSchema } from '../types/opportunity-lost-reason.js';

describe('OpportunityLostReason Zod validation', () => {
  const validSample = {
      "id": "TEST-OpportunityLostReason-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "lost_reason": "Sample Lost Reason"
  };

  it('validates a correct Opportunity Lost Reason object', () => {
    const result = OpportunityLostReasonSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = OpportunityLostReasonInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = OpportunityLostReasonSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
