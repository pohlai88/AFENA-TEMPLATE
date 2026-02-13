import { describe, it, expect } from 'vitest';
import { StockClosingEntrySchema, StockClosingEntryInsertSchema } from '../types/stock-closing-entry.js';

describe('StockClosingEntry Zod validation', () => {
  const validSample = {
      "id": "TEST-StockClosingEntry-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "naming_series": "Option1",
      "company": "LINK-company-001",
      "status": "Draft",
      "from_date": "2024-01-15",
      "to_date": "2024-01-15",
      "amended_from": "LINK-amended_from-001"
  };

  it('validates a correct Stock Closing Entry object', () => {
    const result = StockClosingEntrySchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = StockClosingEntryInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = StockClosingEntrySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
