import { describe, it, expect } from 'vitest';
import { TerritorySchema, TerritoryInsertSchema } from '../types/territory.js';

describe('Territory Zod validation', () => {
  const validSample = {
      "id": "TEST-Territory-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "territory_name": "Sample Territory Name",
      "parent_territory": "LINK-parent_territory-001",
      "is_group": "0",
      "territory_manager": "LINK-territory_manager-001",
      "lft": 1,
      "rgt": 1,
      "old_parent": "LINK-old_parent-001"
  };

  it('validates a correct Territory object', () => {
    const result = TerritorySchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = TerritoryInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "territory_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).territory_name;
    const result = TerritorySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = TerritorySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
