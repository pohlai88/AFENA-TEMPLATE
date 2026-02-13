import { describe, it, expect } from 'vitest';
import { TerritoryItemSchema, TerritoryItemInsertSchema } from '../types/territory-item.js';

describe('TerritoryItem Zod validation', () => {
  const validSample = {
      "id": "TEST-TerritoryItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "territory": "LINK-territory-001"
  };

  it('validates a correct Territory Item object', () => {
    const result = TerritoryItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = TerritoryItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = TerritoryItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
