import { describe, it, expect } from 'vitest';
import { PosInvoiceReferenceSchema, PosInvoiceReferenceInsertSchema } from '../types/pos-invoice-reference.js';

describe('PosInvoiceReference Zod validation', () => {
  const validSample = {
      "id": "TEST-PosInvoiceReference-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "pos_invoice": "LINK-pos_invoice-001",
      "posting_date": "2024-01-15",
      "customer": "LINK-customer-001",
      "grand_total": 100,
      "is_return": "0",
      "return_against": "LINK-return_against-001"
  };

  it('validates a correct POS Invoice Reference object', () => {
    const result = PosInvoiceReferenceSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PosInvoiceReferenceInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "pos_invoice" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).pos_invoice;
    const result = PosInvoiceReferenceSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PosInvoiceReferenceSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
