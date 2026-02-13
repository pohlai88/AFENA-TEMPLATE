import { describe, it, expect } from 'vitest';
import { SalesInvoiceReferenceSchema, SalesInvoiceReferenceInsertSchema } from '../types/sales-invoice-reference.js';

describe('SalesInvoiceReference Zod validation', () => {
  const validSample = {
      "id": "TEST-SalesInvoiceReference-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "sales_invoice": "LINK-sales_invoice-001",
      "posting_date": "2024-01-15",
      "customer": "LINK-customer-001",
      "grand_total": 100,
      "is_return": "0",
      "return_against": "LINK-return_against-001"
  };

  it('validates a correct Sales Invoice Reference object', () => {
    const result = SalesInvoiceReferenceSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SalesInvoiceReferenceInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "sales_invoice" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).sales_invoice;
    const result = SalesInvoiceReferenceSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SalesInvoiceReferenceSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
