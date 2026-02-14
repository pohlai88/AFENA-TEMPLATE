import { describe, it, expect } from 'vitest';
import { TaxWithholdingCategorySchema, TaxWithholdingCategoryInsertSchema } from '../types/tax-withholding-category.js';

describe('TaxWithholdingCategory Zod validation', () => {
  const validSample = {
      "id": "TEST-TaxWithholdingCategory-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "category_name": "Sample Category Name",
      "tax_deduction_basis": "Net Total",
      "round_off_tax_amount": "0",
      "tax_on_excess_amount": "0",
      "disable_cumulative_threshold": "0",
      "disable_transaction_threshold": "0"
  };

  it('validates a correct Tax Withholding Category object', () => {
    const result = TaxWithholdingCategorySchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = TaxWithholdingCategoryInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "tax_deduction_basis" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).tax_deduction_basis;
    const result = TaxWithholdingCategorySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = TaxWithholdingCategorySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
