import { describe, it, expect } from 'vitest';
import { PosPaymentMethodSchema, PosPaymentMethodInsertSchema } from '../types/pos-payment-method.js';

describe('PosPaymentMethod Zod validation', () => {
  const validSample = {
      "id": "TEST-PosPaymentMethod-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "default": "0",
      "allow_in_returns": "0",
      "mode_of_payment": "LINK-mode_of_payment-001"
  };

  it('validates a correct POS Payment Method object', () => {
    const result = PosPaymentMethodSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PosPaymentMethodInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "mode_of_payment" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).mode_of_payment;
    const result = PosPaymentMethodSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PosPaymentMethodSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
