import { describe, it, expect } from 'vitest';
import { CustomerCreditLimitSchema, CustomerCreditLimitInsertSchema } from '../types/customer-credit-limit.js';

describe('CustomerCreditLimit Zod validation', () => {
  const validSample = {
      "id": "TEST-CustomerCreditLimit-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "company": "LINK-company-001",
      "credit_limit": 100,
      "bypass_credit_limit_check": "0"
  };

  it('validates a correct Customer Credit Limit object', () => {
    const result = CustomerCreditLimitSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = CustomerCreditLimitInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = CustomerCreditLimitSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
