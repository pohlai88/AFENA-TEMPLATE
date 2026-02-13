import { describe, it, expect } from 'vitest';
import { PosClosingEntryDetailSchema, PosClosingEntryDetailInsertSchema } from '../types/pos-closing-entry-detail.js';

describe('PosClosingEntryDetail Zod validation', () => {
  const validSample = {
      "id": "TEST-PosClosingEntryDetail-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "mode_of_payment": "LINK-mode_of_payment-001",
      "opening_amount": 100,
      "expected_amount": 100,
      "closing_amount": "0",
      "difference": 100
  };

  it('validates a correct POS Closing Entry Detail object', () => {
    const result = PosClosingEntryDetailSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PosClosingEntryDetailInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "mode_of_payment" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).mode_of_payment;
    const result = PosClosingEntryDetailSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PosClosingEntryDetailSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
