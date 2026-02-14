import { describe, it, expect } from 'vitest';
import { WebsiteItemGroupSchema, WebsiteItemGroupInsertSchema } from '../types/website-item-group.js';

describe('WebsiteItemGroup Zod validation', () => {
  const validSample = {
      "id": "TEST-WebsiteItemGroup-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_group": "LINK-item_group-001"
  };

  it('validates a correct Website Item Group object', () => {
    const result = WebsiteItemGroupSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = WebsiteItemGroupInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "item_group" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).item_group;
    const result = WebsiteItemGroupSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = WebsiteItemGroupSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
