import { describe, it, expect } from 'vitest';
import { PaymentTermsTemplateDetailSchema, PaymentTermsTemplateDetailInsertSchema } from '../types/payment-terms-template-detail.js';

describe('PaymentTermsTemplateDetail Zod validation', () => {
  const validSample = {
      "id": "TEST-PaymentTermsTemplateDetail-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "payment_term": "LINK-payment_term-001",
      "description": "Sample text for description",
      "invoice_portion": 1,
      "mode_of_payment": "LINK-mode_of_payment-001",
      "due_date_based_on": "Day(s) after invoice date",
      "credit_days": "0",
      "credit_months": "0",
      "discount_type": "Percentage",
      "discount": 1,
      "discount_validity_based_on": "Day(s) after invoice date",
      "discount_validity": 1
  };

  it('validates a correct Payment Terms Template Detail object', () => {
    const result = PaymentTermsTemplateDetailSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PaymentTermsTemplateDetailInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "invoice_portion" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).invoice_portion;
    const result = PaymentTermsTemplateDetailSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PaymentTermsTemplateDetailSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
