import { describe, it, expect } from 'vitest';
import { PaymentEntryReferenceSchema, PaymentEntryReferenceInsertSchema } from '../types/payment-entry-reference.js';

describe('PaymentEntryReference Zod validation', () => {
  const validSample = {
      "id": "TEST-PaymentEntryReference-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "reference_doctype": "LINK-reference_doctype-001",
      "reference_name": "LINK-reference_name-001",
      "due_date": "2024-01-15",
      "bill_no": "Sample Supplier Invoice No",
      "payment_term": "LINK-payment_term-001",
      "payment_term_outstanding": 1,
      "account_type": "Sample Account Type",
      "payment_type": "Sample Payment Type",
      "reconcile_effect_on": "2024-01-15",
      "total_amount": 100,
      "outstanding_amount": 100,
      "allocated_amount": 100,
      "exchange_rate": 1,
      "exchange_gain_loss": 100,
      "account": "LINK-account-001",
      "payment_request": "LINK-payment_request-001",
      "payment_request_outstanding": 1,
      "advance_voucher_type": "LINK-advance_voucher_type-001",
      "advance_voucher_no": "LINK-advance_voucher_no-001"
  };

  it('validates a correct Payment Entry Reference object', () => {
    const result = PaymentEntryReferenceSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PaymentEntryReferenceInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "reference_doctype" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).reference_doctype;
    const result = PaymentEntryReferenceSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PaymentEntryReferenceSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
