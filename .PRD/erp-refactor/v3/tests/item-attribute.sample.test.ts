import { describe, it, expect } from 'vitest';
import { ItemAttributeSchema, ItemAttributeInsertSchema } from '../types/item-attribute.js';

describe('ItemAttribute Zod validation', () => {
  const validSample = {
      "id": "TEST-ItemAttribute-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "attribute_name": "Sample Attribute Name",
      "numeric_values": "0",
      "disabled": "0",
      "from_range": "0",
      "increment": "0",
      "to_range": "0"
  };

  it('validates a correct Item Attribute object', () => {
    const result = ItemAttributeSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ItemAttributeInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "attribute_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).attribute_name;
    const result = ItemAttributeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ItemAttributeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
