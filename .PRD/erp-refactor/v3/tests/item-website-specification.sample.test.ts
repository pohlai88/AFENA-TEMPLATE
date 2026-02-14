import { describe, it, expect } from 'vitest';
import { ItemWebsiteSpecificationSchema, ItemWebsiteSpecificationInsertSchema } from '../types/item-website-specification.js';

describe('ItemWebsiteSpecification Zod validation', () => {
  const validSample = {
      "id": "TEST-ItemWebsiteSpecification-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "label": "Sample Label",
      "description": "Sample text for description"
  };

  it('validates a correct Item Website Specification object', () => {
    const result = ItemWebsiteSpecificationSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ItemWebsiteSpecificationInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ItemWebsiteSpecificationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
