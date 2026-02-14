import { describe, it, expect } from 'vitest';
import { PaymentReconciliationAllocationSchema, PaymentReconciliationAllocationInsertSchema } from '../types/payment-reconciliation-allocation.js';

describe('PaymentReconciliationAllocation Zod validation', () => {
  const validSample = {
      "id": "TEST-PaymentReconciliationAllocation-001",
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
      "debit_or_credit_note_posting_date": "2024-01-15",
      "difference_account": "LINK-difference_account-001",
      "exchange_rate": 1,
      "currency": "LINK-currency-001",
      "cost_center": "LINK-cost_center-001"
  };

  it('validates a correct Payment Reconciliation Allocation object', () => {
    const result = PaymentReconciliationAllocationSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PaymentReconciliationAllocationInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "reference_type" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).reference_type;
    const result = PaymentReconciliationAllocationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PaymentReconciliationAllocationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
