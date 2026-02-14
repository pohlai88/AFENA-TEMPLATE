import { describe, it, expect } from 'vitest';
import { PosOpeningEntrySchema, PosOpeningEntryInsertSchema } from '../types/pos-opening-entry.js';

describe('PosOpeningEntry Zod validation', () => {
  const validSample = {
      "id": "TEST-PosOpeningEntry-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "period_start_date": "2024-01-15T10:30:00.000Z",
      "period_end_date": "2024-01-15",
      "status": "Draft",
      "posting_date": "Today",
      "set_posting_date": "0",
      "company": "LINK-company-001",
      "pos_profile": "LINK-pos_profile-001",
      "pos_closing_entry": "Sample POS Closing Entry",
      "user": "LINK-user-001",
      "amended_from": "LINK-amended_from-001"
  };

  it('validates a correct POS Opening Entry object', () => {
    const result = PosOpeningEntrySchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PosOpeningEntryInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "period_start_date" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).period_start_date;
    const result = PosOpeningEntrySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PosOpeningEntrySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
