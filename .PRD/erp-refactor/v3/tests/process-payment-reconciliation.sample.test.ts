import { describe, it, expect } from 'vitest';
import { ProcessPaymentReconciliationSchema, ProcessPaymentReconciliationInsertSchema } from '../types/process-payment-reconciliation.js';

describe('ProcessPaymentReconciliation Zod validation', () => {
  const validSample = {
      "id": "TEST-ProcessPaymentReconciliation-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "company": "LINK-company-001",
      "party_type": "LINK-party_type-001",
      "party": "LINK-party-001",
      "receivable_payable_account": "LINK-receivable_payable_account-001",
      "default_advance_account": "LINK-default_advance_account-001",
      "from_invoice_date": "2024-01-15",
      "to_invoice_date": "2024-01-15",
      "from_payment_date": "2024-01-15",
      "to_payment_date": "2024-01-15",
      "cost_center": "LINK-cost_center-001",
      "bank_cash_account": "LINK-bank_cash_account-001",
      "status": "Queued",
      "error_log": "Sample text for error_log",
      "amended_from": "LINK-amended_from-001"
  };

  it('validates a correct Process Payment Reconciliation object', () => {
    const result = ProcessPaymentReconciliationSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ProcessPaymentReconciliationInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "company" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).company;
    const result = ProcessPaymentReconciliationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ProcessPaymentReconciliationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
