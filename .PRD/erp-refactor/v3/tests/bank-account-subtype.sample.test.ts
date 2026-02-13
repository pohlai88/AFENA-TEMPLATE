import { describe, it, expect } from 'vitest';
import { BankAccountSubtypeSchema, BankAccountSubtypeInsertSchema } from '../types/bank-account-subtype.js';

describe('BankAccountSubtype Zod validation', () => {
  const validSample = {
      "id": "TEST-BankAccountSubtype-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "account_subtype": "Sample Account Subtype"
  };

  it('validates a correct Bank Account Subtype object', () => {
    const result = BankAccountSubtypeSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = BankAccountSubtypeInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = BankAccountSubtypeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
