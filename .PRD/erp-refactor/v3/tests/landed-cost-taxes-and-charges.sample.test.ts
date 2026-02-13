import { describe, it, expect } from 'vitest';
import { LandedCostTaxesAndChargesSchema, LandedCostTaxesAndChargesInsertSchema } from '../types/landed-cost-taxes-and-charges.js';

describe('LandedCostTaxesAndCharges Zod validation', () => {
  const validSample = {
      "id": "TEST-LandedCostTaxesAndCharges-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "expense_account": "LINK-expense_account-001",
      "account_currency": "LINK-account_currency-001",
      "exchange_rate": 1,
      "description": "Sample text for description",
      "amount": 100,
      "base_amount": 100,
      "has_corrective_cost": "0",
      "has_operating_cost": "0"
  };

  it('validates a correct Landed Cost Taxes and Charges object', () => {
    const result = LandedCostTaxesAndChargesSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = LandedCostTaxesAndChargesInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "description" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).description;
    const result = LandedCostTaxesAndChargesSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = LandedCostTaxesAndChargesSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
