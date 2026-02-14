import { describe, it, expect } from 'vitest';
import { TaxWithholdingAccountSchema, TaxWithholdingAccountInsertSchema } from '../types/tax-withholding-account.js';

describe('TaxWithholdingAccount Zod validation', () => {
  const validSample = {
      "id": "TEST-TaxWithholdingAccount-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "company": "LINK-company-001",
      "account": "LINK-account-001"
  };

  it('validates a correct Tax Withholding Account object', () => {
    const result = TaxWithholdingAccountSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = TaxWithholdingAccountInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "company" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).company;
    const result = TaxWithholdingAccountSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = TaxWithholdingAccountSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
