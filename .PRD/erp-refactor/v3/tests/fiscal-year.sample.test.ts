import { describe, it, expect } from 'vitest';
import { FiscalYearSchema, FiscalYearInsertSchema } from '../types/fiscal-year.js';

describe('FiscalYear Zod validation', () => {
  const validSample = {
      "id": "TEST-FiscalYear-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "year": "Sample Year Name",
      "disabled": "0",
      "is_short_year": "0",
      "year_start_date": "2024-01-15",
      "year_end_date": "2024-01-15",
      "auto_created": "0"
  };

  it('validates a correct Fiscal Year object', () => {
    const result = FiscalYearSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = FiscalYearInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "year" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).year;
    const result = FiscalYearSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = FiscalYearSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
