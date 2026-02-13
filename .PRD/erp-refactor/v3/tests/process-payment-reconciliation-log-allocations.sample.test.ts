import { describe, it, expect } from 'vitest';
import { ProcessPaymentReconciliationLogAllocationsSchema, ProcessPaymentReconciliationLogAllocationsInsertSchema } from '../types/process-payment-reconciliation-log-allocations.js';

describe('ProcessPaymentReconciliationLogAllocations Zod validation', () => {
  const validSample = {
      "id": "TEST-ProcessPaymentReconciliationLogAllocations-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "reference_type": "LINK-reference_type-001",
      "reference_name": "LINK-reference_name-001",
      "reference_row": "Sample Reference Row",
      "invoice_type": "LINK-invoice_type-001",
      "invoice_number": "LINK-invoice_number-001",
      "allocated_amount": 100,
      "unreconciled_amount": 100,
      "amount": 100,
      "is_advance": "Sample Is Advance",
      "difference_amount": 100,
      "gain_loss_posting_date": "2024-01-15",
      "difference_account": "LINK-difference_account-001",
      "exchange_rate": 1,
      "currency": "LINK-currency-001",
      "reconciled": "0"
  };

  it('validates a correct Process Payment Reconciliation Log Allocations object', () => {
    const result = ProcessPaymentReconciliationLogAllocationsSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ProcessPaymentReconciliationLogAllocationsInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "reference_type" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).reference_type;
    const result = ProcessPaymentReconciliationLogAllocationsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ProcessPaymentReconciliationLogAllocationsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
