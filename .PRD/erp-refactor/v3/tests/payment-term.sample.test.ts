import { describe, it, expect } from 'vitest';
import { PaymentTermSchema, PaymentTermInsertSchema } from '../types/payment-term.js';

describe('PaymentTerm Zod validation', () => {
  const validSample = {
      "id": "TEST-PaymentTerm-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "payment_term_name": "Sample Payment Term Name",
      "invoice_portion": 1,
      "mode_of_payment": "LINK-mode_of_payment-001",
      "due_date_based_on": "Day(s) after invoice date",
      "credit_days": 1,
      "credit_months": 1,
      "discount_type": "Percentage",
      "discount": 1,
      "discount_validity_based_on": "Day(s) after invoice date",
      "discount_validity": 1,
      "description": "Sample text for description"
  };

  it('validates a correct Payment Term object', () => {
    const result = PaymentTermSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PaymentTermInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PaymentTermSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
