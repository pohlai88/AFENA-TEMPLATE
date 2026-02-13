import { describe, it, expect } from 'vitest';
import { AdvanceTaxesAndChargesSchema, AdvanceTaxesAndChargesInsertSchema } from '../types/advance-taxes-and-charges.js';

describe('AdvanceTaxesAndCharges Zod validation', () => {
  const validSample = {
      "id": "TEST-AdvanceTaxesAndCharges-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "add_deduct_tax": "Add",
      "charge_type": "Actual",
      "row_id": "Sample Reference Row #",
      "account_head": "LINK-account_head-001",
      "description": "Sample text for description",
      "included_in_paid_amount": "0",
      "set_by_item_tax_template": "0",
      "is_tax_withholding_account": "0",
      "cost_center": ":Company",
      "project": "LINK-project-001",
      "rate": 1,
      "currency": "LINK-currency-001",
      "net_amount": 100,
      "tax_amount": 100,
      "total": 100,
      "base_tax_amount": 100,
      "base_net_amount": 100,
      "base_total": 100
  };

  it('validates a correct Advance Taxes and Charges object', () => {
    const result = AdvanceTaxesAndChargesSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = AdvanceTaxesAndChargesInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "add_deduct_tax" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).add_deduct_tax;
    const result = AdvanceTaxesAndChargesSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = AdvanceTaxesAndChargesSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
