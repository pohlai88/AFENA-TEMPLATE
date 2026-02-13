import { describe, it, expect } from 'vitest';
import { PaymentOrderSchema, PaymentOrderInsertSchema } from '../types/payment-order.js';

describe('PaymentOrder Zod validation', () => {
  const validSample = {
      "id": "TEST-PaymentOrder-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "naming_series": "PMO-",
      "company": "LINK-company-001",
      "payment_order_type": "Payment Request",
      "party": "LINK-party-001",
      "posting_date": "Today",
      "company_bank": "LINK-company_bank-001",
      "company_bank_account": "LINK-company_bank_account-001",
      "account": "Sample Account",
      "amended_from": "LINK-amended_from-001"
  };

  it('validates a correct Payment Order object', () => {
    const result = PaymentOrderSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PaymentOrderInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "naming_series" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).naming_series;
    const result = PaymentOrderSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PaymentOrderSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
