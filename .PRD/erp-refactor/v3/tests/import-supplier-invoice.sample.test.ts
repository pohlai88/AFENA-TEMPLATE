import { describe, it, expect } from 'vitest';
import { ImportSupplierInvoiceSchema, ImportSupplierInvoiceInsertSchema } from '../types/import-supplier-invoice.js';

describe('ImportSupplierInvoice Zod validation', () => {
  const validSample = {
      "id": "TEST-ImportSupplierInvoice-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "invoice_series": "ACC-PINV-.YYYY.-",
      "company": "LINK-company-001",
      "item_code": "LINK-item_code-001",
      "supplier_group": "LINK-supplier_group-001",
      "tax_account": "LINK-tax_account-001",
      "default_buying_price_list": "LINK-default_buying_price_list-001",
      "zip_file": "/files/sample.png",
      "status": "Sample Status"
  };

  it('validates a correct Import Supplier Invoice object', () => {
    const result = ImportSupplierInvoiceSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ImportSupplierInvoiceInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "invoice_series" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).invoice_series;
    const result = ImportSupplierInvoiceSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ImportSupplierInvoiceSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
