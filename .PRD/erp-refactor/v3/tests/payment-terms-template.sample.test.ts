import { describe, it, expect } from 'vitest';
import { PaymentTermsTemplateSchema, PaymentTermsTemplateInsertSchema } from '../types/payment-terms-template.js';

describe('PaymentTermsTemplate Zod validation', () => {
  const validSample = {
      "id": "TEST-PaymentTermsTemplate-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "template_name": "Sample Template Name",
      "allocate_payment_based_on_payment_terms": "0"
  };

  it('validates a correct Payment Terms Template object', () => {
    const result = PaymentTermsTemplateSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PaymentTermsTemplateInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "terms" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).terms;
    const result = PaymentTermsTemplateSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PaymentTermsTemplateSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
