import { describe, it, expect } from 'vitest';
import { OverduePaymentSchema, OverduePaymentInsertSchema } from '../types/overdue-payment.js';

describe('OverduePayment Zod validation', () => {
  const validSample = {
      "id": "TEST-OverduePayment-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "sales_invoice": "LINK-sales_invoice-001",
      "payment_schedule": "Sample Payment Schedule",
      "dunning_level": "1",
      "payment_term": "LINK-payment_term-001",
      "description": "Sample text for description",
      "due_date": "2024-01-15",
      "overdue_days": "Sample Overdue Days",
      "mode_of_payment": "LINK-mode_of_payment-001",
      "invoice_portion": 1,
      "payment_amount": 100,
      "outstanding": 100,
      "paid_amount": 100,
      "discounted_amount": "0",
      "interest": 100
  };

  it('validates a correct Overdue Payment object', () => {
    const result = OverduePaymentSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = OverduePaymentInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "sales_invoice" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).sales_invoice;
    const result = OverduePaymentSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = OverduePaymentSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
