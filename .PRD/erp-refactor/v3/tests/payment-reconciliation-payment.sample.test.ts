import { describe, it, expect } from 'vitest';
import { PaymentReconciliationPaymentSchema, PaymentReconciliationPaymentInsertSchema } from '../types/payment-reconciliation-payment.js';

describe('PaymentReconciliationPayment Zod validation', () => {
  const validSample = {
      "id": "TEST-PaymentReconciliationPayment-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "reference_type": "LINK-reference_type-001",
      "reference_name": "LINK-reference_name-001",
      "posting_date": "2024-01-15",
      "is_advance": "Sample Is Advance",
      "reference_row": "Sample Reference Row",
      "amount": 100,
      "difference_amount": 100,
      "remarks": "Sample text for remarks",
      "currency": "LINK-currency-001",
      "exchange_rate": 1,
      "cost_center": "LINK-cost_center-001"
  };

  it('validates a correct Payment Reconciliation Payment object', () => {
    const result = PaymentReconciliationPaymentSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PaymentReconciliationPaymentInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PaymentReconciliationPaymentSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
