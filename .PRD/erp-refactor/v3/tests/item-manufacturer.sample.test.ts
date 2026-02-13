import { describe, it, expect } from 'vitest';
import { ItemManufacturerSchema, ItemManufacturerInsertSchema } from '../types/item-manufacturer.js';

describe('ItemManufacturer Zod validation', () => {
  const validSample = {
      "id": "TEST-ItemManufacturer-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_code": "LINK-item_code-001",
      "manufacturer": "LINK-manufacturer-001",
      "manufacturer_part_no": "Sample Manufacturer Part Number",
      "item_name": "Sample Item Name",
      "description": "Sample text for description",
      "is_default": "0"
  };

  it('validates a correct Item Manufacturer object', () => {
    const result = ItemManufacturerSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ItemManufacturerInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "item_code" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).item_code;
    const result = ItemManufacturerSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ItemManufacturerSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
