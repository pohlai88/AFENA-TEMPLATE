import { describe, it, expect } from 'vitest';
import { BomWebsiteItemSchema, BomWebsiteItemInsertSchema } from '../types/bom-website-item.js';

describe('BomWebsiteItem Zod validation', () => {
  const validSample = {
      "id": "TEST-BomWebsiteItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_code": "LINK-item_code-001",
      "item_name": "Sample Item Name",
      "description": "Sample text for description",
      "qty": 1,
      "website_image": "/files/sample.png"
  };

  it('validates a correct BOM Website Item object', () => {
    const result = BomWebsiteItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = BomWebsiteItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = BomWebsiteItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
