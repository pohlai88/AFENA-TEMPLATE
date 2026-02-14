import { describe, it, expect } from 'vitest';
import { LandedCostVoucherSchema, LandedCostVoucherInsertSchema } from '../types/landed-cost-voucher.js';

describe('LandedCostVoucher Zod validation', () => {
  const validSample = {
      "id": "TEST-LandedCostVoucher-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "naming_series": "Option1",
      "company": "LINK-company-001",
      "posting_date": "Today",
      "total_vendor_invoices_cost": 100,
      "total_taxes_and_charges": 100,
      "distribute_charges_based_on": "Qty",
      "amended_from": "LINK-amended_from-001",
      "landed_cost_help": "Sample text for landed_cost_help"
  };

  it('validates a correct Landed Cost Voucher object', () => {
    const result = LandedCostVoucherSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = LandedCostVoucherInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "naming_series" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).naming_series;
    const result = LandedCostVoucherSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = LandedCostVoucherSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
