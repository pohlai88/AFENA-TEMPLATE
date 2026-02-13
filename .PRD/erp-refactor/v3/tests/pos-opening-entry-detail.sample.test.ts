import { describe, it, expect } from 'vitest';
import { PosOpeningEntryDetailSchema, PosOpeningEntryDetailInsertSchema } from '../types/pos-opening-entry-detail.js';

describe('PosOpeningEntryDetail Zod validation', () => {
  const validSample = {
      "id": "TEST-PosOpeningEntryDetail-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "mode_of_payment": "LINK-mode_of_payment-001",
      "opening_amount": "0"
  };

  it('validates a correct POS Opening Entry Detail object', () => {
    const result = PosOpeningEntryDetailSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PosOpeningEntryDetailInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "mode_of_payment" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).mode_of_payment;
    const result = PosOpeningEntryDetailSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PosOpeningEntryDetailSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
