import { describe, it, expect } from 'vitest';
import { LowerDeductionCertificateSchema, LowerDeductionCertificateInsertSchema } from '../types/lower-deduction-certificate.js';

describe('LowerDeductionCertificate Zod validation', () => {
  const validSample = {
      "id": "TEST-LowerDeductionCertificate-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "tax_withholding_category": "LINK-tax_withholding_category-001",
      "fiscal_year": "LINK-fiscal_year-001",
      "company": "LINK-company-001",
      "certificate_no": "Sample Certificate No",
      "supplier": "LINK-supplier-001",
      "pan_no": "Sample PAN No",
      "valid_from": "2024-01-15",
      "valid_upto": "2024-01-15",
      "rate": 1,
      "certificate_limit": 100
  };

  it('validates a correct Lower Deduction Certificate object', () => {
    const result = LowerDeductionCertificateSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = LowerDeductionCertificateInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "tax_withholding_category" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).tax_withholding_category;
    const result = LowerDeductionCertificateSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = LowerDeductionCertificateSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
