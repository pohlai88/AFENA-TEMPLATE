import { describe, it, expect } from 'vitest';
import { ItemGroupSchema, ItemGroupInsertSchema } from '../types/item-group.js';

describe('ItemGroup Zod validation', () => {
  const validSample = {
      "id": "TEST-ItemGroup-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_group_name": "Sample Item Group Name",
      "parent_item_group": "LINK-parent_item_group-001",
      "is_group": "0",
      "image": "/files/sample.png",
      "lft": 1,
      "old_parent": "LINK-old_parent-001",
      "rgt": 1
  };

  it('validates a correct Item Group object', () => {
    const result = ItemGroupSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ItemGroupInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "item_group_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).item_group_name;
    const result = ItemGroupSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ItemGroupSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
