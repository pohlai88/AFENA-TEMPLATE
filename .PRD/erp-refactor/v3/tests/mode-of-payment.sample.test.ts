import { describe, it, expect } from 'vitest';
import { ModeOfPaymentSchema, ModeOfPaymentInsertSchema } from '../types/mode-of-payment.js';

describe('ModeOfPayment Zod validation', () => {
  const validSample = {
      "id": "TEST-ModeOfPayment-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "mode_of_payment": "Sample Mode of Payment",
      "enabled": "1",
      "type": "Cash"
  };

  it('validates a correct Mode of Payment object', () => {
    const result = ModeOfPaymentSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ModeOfPaymentInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "mode_of_payment" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).mode_of_payment;
    const result = ModeOfPaymentSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ModeOfPaymentSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
