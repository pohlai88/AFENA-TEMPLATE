import { describe, it, expect } from 'vitest';
import { FiscalYearCompanySchema, FiscalYearCompanyInsertSchema } from '../types/fiscal-year-company.js';

describe('FiscalYearCompany Zod validation', () => {
  const validSample = {
      "id": "TEST-FiscalYearCompany-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "company": "LINK-company-001"
  };

  it('validates a correct Fiscal Year Company object', () => {
    const result = FiscalYearCompanySchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = FiscalYearCompanyInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = FiscalYearCompanySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
