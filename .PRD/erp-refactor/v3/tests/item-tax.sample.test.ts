import { describe, it, expect } from 'vitest';
import { ItemTaxSchema, ItemTaxInsertSchema } from '../types/item-tax.js';

describe('ItemTax Zod validation', () => {
  const validSample = {
      "id": "TEST-ItemTax-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_tax_template": "LINK-item_tax_template-001",
      "tax_category": "LINK-tax_category-001",
      "valid_from": "2024-01-15",
      "minimum_net_rate": 1,
      "maximum_net_rate": 1
  };

  it('validates a correct Item Tax object', () => {
    const result = ItemTaxSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ItemTaxInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "item_tax_template" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).item_tax_template;
    const result = ItemTaxSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ItemTaxSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
