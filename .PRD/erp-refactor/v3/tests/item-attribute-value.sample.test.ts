import { describe, it, expect } from 'vitest';
import { ItemAttributeValueSchema, ItemAttributeValueInsertSchema } from '../types/item-attribute-value.js';

describe('ItemAttributeValue Zod validation', () => {
  const validSample = {
      "id": "TEST-ItemAttributeValue-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "attribute_value": "Sample Attribute Value",
      "abbr": "Sample Abbreviation"
  };

  it('validates a correct Item Attribute Value object', () => {
    const result = ItemAttributeValueSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ItemAttributeValueInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "attribute_value" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).attribute_value;
    const result = ItemAttributeValueSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ItemAttributeValueSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
