import { describe, it, expect } from 'vitest';
import { LandedCostVendorInvoiceSchema, LandedCostVendorInvoiceInsertSchema } from '../types/landed-cost-vendor-invoice.js';

describe('LandedCostVendorInvoice Zod validation', () => {
  const validSample = {
      "id": "TEST-LandedCostVendorInvoice-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "vendor_invoice": "LINK-vendor_invoice-001",
      "amount": 100
  };

  it('validates a correct Landed Cost Vendor Invoice object', () => {
    const result = LandedCostVendorInvoiceSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = LandedCostVendorInvoiceInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = LandedCostVendorInvoiceSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
