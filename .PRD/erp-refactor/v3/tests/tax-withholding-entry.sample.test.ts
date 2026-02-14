import { describe, it, expect } from 'vitest';
import { TaxWithholdingEntrySchema, TaxWithholdingEntryInsertSchema } from '../types/tax-withholding-entry.js';

describe('TaxWithholdingEntry Zod validation', () => {
  const validSample = {
      "id": "TEST-TaxWithholdingEntry-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "company": "LINK-company-001",
      "party_type": "LINK-party_type-001",
      "party": "LINK-party-001",
      "tax_id": "Sample Tax ID",
      "tax_withholding_category": "LINK-tax_withholding_category-001",
      "tax_withholding_group": "LINK-tax_withholding_group-001",
      "taxable_amount": 100,
      "tax_rate": 1,
      "withholding_amount": 100,
      "taxable_doctype": "LINK-taxable_doctype-001",
      "taxable_name": "LINK-taxable_name-001",
      "taxable_date": "2024-01-15",
      "currency": "LINK-currency-001",
      "conversion_rate": 1,
      "under_withheld_reason": "Threshold Exemption",
      "lower_deduction_certificate": "LINK-lower_deduction_certificate-001",
      "withholding_doctype": "LINK-withholding_doctype-001",
      "withholding_name": "LINK-withholding_name-001",
      "withholding_date": "2024-01-15",
      "status": "Settled",
      "created_by_migration": "0"
  };

  it('validates a correct Tax Withholding Entry object', () => {
    const result = TaxWithholdingEntrySchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = TaxWithholdingEntryInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = TaxWithholdingEntrySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
