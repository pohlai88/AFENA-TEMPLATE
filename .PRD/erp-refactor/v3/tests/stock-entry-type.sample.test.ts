import { describe, it, expect } from 'vitest';
import { StockEntryTypeSchema, StockEntryTypeInsertSchema } from '../types/stock-entry-type.js';

describe('StockEntryType Zod validation', () => {
  const validSample = {
      "id": "TEST-StockEntryType-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "purpose": "Material Issue",
      "add_to_transit": "0",
      "is_standard": "0"
  };

  it('validates a correct Stock Entry Type object', () => {
    const result = StockEntryTypeSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = StockEntryTypeInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "purpose" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).purpose;
    const result = StockEntryTypeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = StockEntryTypeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
