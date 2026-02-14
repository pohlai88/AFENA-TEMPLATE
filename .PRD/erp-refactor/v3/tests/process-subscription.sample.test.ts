import { describe, it, expect } from 'vitest';
import { ProcessSubscriptionSchema, ProcessSubscriptionInsertSchema } from '../types/process-subscription.js';

describe('ProcessSubscription Zod validation', () => {
  const validSample = {
      "id": "TEST-ProcessSubscription-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "posting_date": "2024-01-15",
      "subscription": "LINK-subscription-001",
      "amended_from": "LINK-amended_from-001"
  };

  it('validates a correct Process Subscription object', () => {
    const result = ProcessSubscriptionSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ProcessSubscriptionInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "posting_date" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).posting_date;
    const result = ProcessSubscriptionSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ProcessSubscriptionSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
