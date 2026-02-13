import { describe, it, expect } from 'vitest';
import { PaymentOrderReferenceSchema, PaymentOrderReferenceInsertSchema } from '../types/payment-order-reference.js';

describe('PaymentOrderReference Zod validation', () => {
  const validSample = {
      "id": "TEST-PaymentOrderReference-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "reference_doctype": "LINK-reference_doctype-001",
      "reference_name": "LINK-reference_name-001",
      "amount": 100,
      "supplier": "LINK-supplier-001",
      "payment_request": "LINK-payment_request-001",
      "mode_of_payment": "LINK-mode_of_payment-001",
      "bank_account": "LINK-bank_account-001",
      "account": "LINK-account-001",
      "payment_reference": "Sample Payment Reference"
  };

  it('validates a correct Payment Order Reference object', () => {
    const result = PaymentOrderReferenceSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PaymentOrderReferenceInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "reference_doctype" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).reference_doctype;
    const result = PaymentOrderReferenceSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PaymentOrderReferenceSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
