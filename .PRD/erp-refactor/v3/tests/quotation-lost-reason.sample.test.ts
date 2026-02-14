import { describe, it, expect } from 'vitest';
import { QuotationLostReasonSchema, QuotationLostReasonInsertSchema } from '../types/quotation-lost-reason.js';

describe('QuotationLostReason Zod validation', () => {
  const validSample = {
      "id": "TEST-QuotationLostReason-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "order_lost_reason": "Sample Quotation Lost Reason"
  };

  it('validates a correct Quotation Lost Reason object', () => {
    const result = QuotationLostReasonSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = QuotationLostReasonInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "order_lost_reason" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).order_lost_reason;
    const result = QuotationLostReasonSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = QuotationLostReasonSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
