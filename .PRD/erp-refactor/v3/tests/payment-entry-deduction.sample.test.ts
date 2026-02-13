import { describe, it, expect } from 'vitest';
import { PaymentEntryDeductionSchema, PaymentEntryDeductionInsertSchema } from '../types/payment-entry-deduction.js';

describe('PaymentEntryDeduction Zod validation', () => {
  const validSample = {
      "id": "TEST-PaymentEntryDeduction-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "account": "LINK-account-001",
      "cost_center": "LINK-cost_center-001",
      "amount": 100,
      "is_exchange_gain_loss": "0",
      "description": "Sample text for description"
  };

  it('validates a correct Payment Entry Deduction object', () => {
    const result = PaymentEntryDeductionSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PaymentEntryDeductionInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "account" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).account;
    const result = PaymentEntryDeductionSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PaymentEntryDeductionSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
