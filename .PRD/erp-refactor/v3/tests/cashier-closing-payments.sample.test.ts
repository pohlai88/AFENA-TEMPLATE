import { describe, it, expect } from 'vitest';
import { CashierClosingPaymentsSchema, CashierClosingPaymentsInsertSchema } from '../types/cashier-closing-payments.js';

describe('CashierClosingPayments Zod validation', () => {
  const validSample = {
      "id": "TEST-CashierClosingPayments-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "mode_of_payment": "LINK-mode_of_payment-001",
      "amount": "0.00"
  };

  it('validates a correct Cashier Closing Payments object', () => {
    const result = CashierClosingPaymentsSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = CashierClosingPaymentsInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "mode_of_payment" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).mode_of_payment;
    const result = CashierClosingPaymentsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = CashierClosingPaymentsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
