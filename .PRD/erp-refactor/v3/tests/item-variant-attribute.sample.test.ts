import { describe, it, expect } from 'vitest';
import { ItemVariantAttributeSchema, ItemVariantAttributeInsertSchema } from '../types/item-variant-attribute.js';

describe('ItemVariantAttribute Zod validation', () => {
  const validSample = {
      "id": "TEST-ItemVariantAttribute-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "variant_of": "LINK-variant_of-001",
      "attribute": "LINK-attribute-001",
      "attribute_value": "Sample Attribute Value",
      "numeric_values": "0",
      "disabled": "0",
      "from_range": 1,
      "increment": 1,
      "to_range": 1
  };

  it('validates a correct Item Variant Attribute object', () => {
    const result = ItemVariantAttributeSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ItemVariantAttributeInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "attribute" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).attribute;
    const result = ItemVariantAttributeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ItemVariantAttributeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
