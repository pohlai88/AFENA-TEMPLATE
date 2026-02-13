import { describe, it, expect } from 'vitest';
import { PaymentReconciliationSchema, PaymentReconciliationInsertSchema } from '../types/payment-reconciliation.js';

describe('PaymentReconciliation Zod validation', () => {
  const validSample = {
      "id": "TEST-PaymentReconciliation-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "company": "LINK-company-001",
      "party_type": "LINK-party_type-001",
      "party": "LINK-party-001",
      "receivable_payable_account": "LINK-receivable_payable_account-001",
      "default_advance_account": "LINK-default_advance_account-001",
      "from_invoice_date": "2024-01-15",
      "from_payment_date": "2024-01-15",
      "minimum_invoice_amount": 100,
      "minimum_payment_amount": 100,
      "to_invoice_date": "2024-01-15",
      "to_payment_date": "2024-01-15",
      "maximum_invoice_amount": 100,
      "maximum_payment_amount": 100,
      "invoice_limit": "50",
      "payment_limit": "50",
      "bank_cash_account": "LINK-bank_cash_account-001",
      "cost_center": "LINK-cost_center-001",
      "project": "LINK-project-001",
      "invoice_name": "Sample Filter on Invoice",
      "payment_name": "Sample Filter on Payment"
  };

  it('validates a correct Payment Reconciliation object', () => {
    const result = PaymentReconciliationSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PaymentReconciliationInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "company" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).company;
    const result = PaymentReconciliationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PaymentReconciliationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
