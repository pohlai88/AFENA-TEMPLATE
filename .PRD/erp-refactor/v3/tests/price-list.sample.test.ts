import { describe, it, expect } from 'vitest';
import { PriceListSchema, PriceListInsertSchema } from '../types/price-list.js';

describe('PriceList Zod validation', () => {
  const validSample = {
      "id": "TEST-PriceList-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "enabled": "1",
      "price_list_name": "Sample Price List Name",
      "currency": "LINK-currency-001",
      "buying": "0",
      "selling": "0",
      "price_not_uom_dependent": "0"
  };

  it('validates a correct Price List object', () => {
    const result = PriceListSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PriceListInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "price_list_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).price_list_name;
    const result = PriceListSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PriceListSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
