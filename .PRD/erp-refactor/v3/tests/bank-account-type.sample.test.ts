import { describe, it, expect } from 'vitest';
import { BankAccountTypeSchema, BankAccountTypeInsertSchema } from '../types/bank-account-type.js';

describe('BankAccountType Zod validation', () => {
  const validSample = {
      "id": "TEST-BankAccountType-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "account_type": "Sample Account Type"
  };

  it('validates a correct Bank Account Type object', () => {
    const result = BankAccountTypeSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = BankAccountTypeInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = BankAccountTypeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
