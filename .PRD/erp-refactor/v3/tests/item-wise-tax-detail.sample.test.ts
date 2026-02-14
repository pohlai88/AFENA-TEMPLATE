import { describe, it, expect } from 'vitest';
import { ItemWiseTaxDetailSchema, ItemWiseTaxDetailInsertSchema } from '../types/item-wise-tax-detail.js';

describe('ItemWiseTaxDetail Zod validation', () => {
  const validSample = {
      "id": "TEST-ItemWiseTaxDetail-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_row": "Sample Item Row",
      "tax_row": "Sample Tax Row",
      "rate": 1,
      "amount": 100,
      "taxable_amount": 100
  };

  it('validates a correct Item Wise Tax Detail object', () => {
    const result = ItemWiseTaxDetailSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ItemWiseTaxDetailInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "item_row" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).item_row;
    const result = ItemWiseTaxDetailSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ItemWiseTaxDetailSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
