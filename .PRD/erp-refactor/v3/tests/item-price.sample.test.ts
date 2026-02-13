import { describe, it, expect } from 'vitest';
import { ItemPriceSchema, ItemPriceInsertSchema } from '../types/item-price.js';

describe('ItemPrice Zod validation', () => {
  const validSample = {
      "id": "TEST-ItemPrice-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_code": "LINK-item_code-001",
      "uom": "LINK-uom-001",
      "packing_unit": "0",
      "item_name": "Sample Item Name",
      "brand": "LINK-brand-001",
      "item_description": "Sample text for item_description",
      "price_list": "LINK-price_list-001",
      "customer": "LINK-customer-001",
      "supplier": "LINK-supplier-001",
      "batch_no": "LINK-batch_no-001",
      "buying": "0",
      "selling": "0",
      "currency": "LINK-currency-001",
      "price_list_rate": 100,
      "valid_from": "Today",
      "lead_time_days": "0",
      "valid_upto": "2024-01-15",
      "note": "Sample text for note",
      "reference": "Sample Reference"
  };

  it('validates a correct Item Price object', () => {
    const result = ItemPriceSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ItemPriceInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "item_code" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).item_code;
    const result = ItemPriceSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ItemPriceSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
