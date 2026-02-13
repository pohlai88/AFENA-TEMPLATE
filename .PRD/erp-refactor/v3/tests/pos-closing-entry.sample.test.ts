import { describe, it, expect } from 'vitest';
import { PosClosingEntrySchema, PosClosingEntryInsertSchema } from '../types/pos-closing-entry.js';

describe('PosClosingEntry Zod validation', () => {
  const validSample = {
      "id": "TEST-PosClosingEntry-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "period_start_date": "2024-01-15T10:30:00.000Z",
      "period_end_date": "Today",
      "posting_date": "Today",
      "posting_time": "Now",
      "pos_opening_entry": "LINK-pos_opening_entry-001",
      "status": "Draft",
      "company": "LINK-company-001",
      "pos_profile": "LINK-pos_profile-001",
      "user": "LINK-user-001",
      "total_quantity": 1,
      "net_total": "0",
      "total_taxes_and_charges": 100,
      "grand_total": "0",
      "error_message": "Sample text for error_message",
      "amended_from": "LINK-amended_from-001"
  };

  it('validates a correct POS Closing Entry object', () => {
    const result = PosClosingEntrySchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PosClosingEntryInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "period_start_date" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).period_start_date;
    const result = PosClosingEntrySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PosClosingEntrySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
