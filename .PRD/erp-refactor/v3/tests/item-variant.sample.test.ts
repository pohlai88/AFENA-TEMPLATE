import { describe, it, expect } from 'vitest';
import { ItemVariantSchema, ItemVariantInsertSchema } from '../types/item-variant.js';

describe('ItemVariant Zod validation', () => {
  const validSample = {
      "id": "TEST-ItemVariant-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_attribute": "LINK-item_attribute-001",
      "item_attribute_value": "Sample Item Attribute Value"
  };

  it('validates a correct Item Variant object', () => {
    const result = ItemVariantSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ItemVariantInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "item_attribute" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).item_attribute;
    const result = ItemVariantSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ItemVariantSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
