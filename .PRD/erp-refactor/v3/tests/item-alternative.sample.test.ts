import { describe, it, expect } from 'vitest';
import { ItemAlternativeSchema, ItemAlternativeInsertSchema } from '../types/item-alternative.js';

describe('ItemAlternative Zod validation', () => {
  const validSample = {
      "id": "TEST-ItemAlternative-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_code": "LINK-item_code-001",
      "alternative_item_code": "LINK-alternative_item_code-001",
      "two_way": "0",
      "item_name": "Read Only Value",
      "alternative_item_name": "Read Only Value"
  };

  it('validates a correct Item Alternative object', () => {
    const result = ItemAlternativeSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ItemAlternativeInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ItemAlternativeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
