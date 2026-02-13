import { describe, it, expect } from 'vitest';
import { QuotationLostReasonDetailSchema, QuotationLostReasonDetailInsertSchema } from '../types/quotation-lost-reason-detail.js';

describe('QuotationLostReasonDetail Zod validation', () => {
  const validSample = {
      "id": "TEST-QuotationLostReasonDetail-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "lost_reason": "LINK-lost_reason-001"
  };

  it('validates a correct Quotation Lost Reason Detail object', () => {
    const result = QuotationLostReasonDetailSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = QuotationLostReasonDetailInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = QuotationLostReasonDetailSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
