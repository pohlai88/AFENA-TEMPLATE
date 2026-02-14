import { describe, it, expect } from 'vitest';
import { RequestForQuotationSupplierSchema, RequestForQuotationSupplierInsertSchema } from '../types/request-for-quotation-supplier.js';

describe('RequestForQuotationSupplier Zod validation', () => {
  const validSample = {
      "id": "TEST-RequestForQuotationSupplier-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "supplier": "LINK-supplier-001",
      "contact": "LINK-contact-001",
      "quote_status": "Pending",
      "supplier_name": "Read Only Value",
      "email_id": "Sample Email ID",
      "send_email": "1",
      "email_sent": "0"
  };

  it('validates a correct Request for Quotation Supplier object', () => {
    const result = RequestForQuotationSupplierSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = RequestForQuotationSupplierInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "supplier" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).supplier;
    const result = RequestForQuotationSupplierSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = RequestForQuotationSupplierSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
