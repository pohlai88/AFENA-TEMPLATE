import { describe, it, expect } from 'vitest';
import { PurchaseInvoiceAdvanceSchema, PurchaseInvoiceAdvanceInsertSchema } from '../types/purchase-invoice-advance.js';

describe('PurchaseInvoiceAdvance Zod validation', () => {
  const validSample = {
      "id": "TEST-PurchaseInvoiceAdvance-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "reference_type": "LINK-reference_type-001",
      "reference_name": "LINK-reference_name-001",
      "remarks": "Sample text for remarks",
      "reference_row": "Sample Reference Row",
      "advance_amount": 100,
      "allocated_amount": 100,
      "exchange_gain_loss": 100,
      "ref_exchange_rate": 1,
      "difference_posting_date": "2024-01-15"
  };

  it('validates a correct Purchase Invoice Advance object', () => {
    const result = PurchaseInvoiceAdvanceSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PurchaseInvoiceAdvanceInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PurchaseInvoiceAdvanceSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
