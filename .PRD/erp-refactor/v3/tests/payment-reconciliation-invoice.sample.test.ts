import { describe, it, expect } from 'vitest';
import { PaymentReconciliationInvoiceSchema, PaymentReconciliationInvoiceInsertSchema } from '../types/payment-reconciliation-invoice.js';

describe('PaymentReconciliationInvoice Zod validation', () => {
  const validSample = {
      "id": "TEST-PaymentReconciliationInvoice-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "invoice_type": "Sales Invoice",
      "invoice_number": "LINK-invoice_number-001",
      "invoice_date": "2024-01-15",
      "amount": 100,
      "outstanding_amount": 100,
      "currency": "LINK-currency-001",
      "exchange_rate": 1
  };

  it('validates a correct Payment Reconciliation Invoice object', () => {
    const result = PaymentReconciliationInvoiceSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PaymentReconciliationInvoiceInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PaymentReconciliationInvoiceSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
