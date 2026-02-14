import { describe, it, expect } from 'vitest';
import { ModeOfPaymentAccountSchema, ModeOfPaymentAccountInsertSchema } from '../types/mode-of-payment-account.js';

describe('ModeOfPaymentAccount Zod validation', () => {
  const validSample = {
      "id": "TEST-ModeOfPaymentAccount-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "company": "LINK-company-001",
      "default_account": "LINK-default_account-001"
  };

  it('validates a correct Mode of Payment Account object', () => {
    const result = ModeOfPaymentAccountSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ModeOfPaymentAccountInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ModeOfPaymentAccountSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
