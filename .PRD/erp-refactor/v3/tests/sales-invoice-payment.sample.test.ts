import { describe, it, expect } from 'vitest';
import { SalesInvoicePaymentSchema, SalesInvoicePaymentInsertSchema } from '../types/sales-invoice-payment.js';

describe('SalesInvoicePayment Zod validation', () => {
  const validSample = {
      "id": "TEST-SalesInvoicePayment-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "default": "0",
      "mode_of_payment": "LINK-mode_of_payment-001",
      "amount": "0",
      "reference_no": "Sample Reference No",
      "account": "LINK-account-001",
      "type": "Read Only Value",
      "base_amount": 100,
      "clearance_date": "2024-01-15"
  };

  it('validates a correct Sales Invoice Payment object', () => {
    const result = SalesInvoicePaymentSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SalesInvoicePaymentInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "mode_of_payment" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).mode_of_payment;
    const result = SalesInvoicePaymentSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SalesInvoicePaymentSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
