import { describe, it, expect } from 'vitest';
import { PosClosingEntryTaxesSchema, PosClosingEntryTaxesInsertSchema } from '../types/pos-closing-entry-taxes.js';

describe('PosClosingEntryTaxes Zod validation', () => {
  const validSample = {
      "id": "TEST-PosClosingEntryTaxes-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "account_head": "LINK-account_head-001",
      "amount": 100
  };

  it('validates a correct POS Closing Entry Taxes object', () => {
    const result = PosClosingEntryTaxesSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PosClosingEntryTaxesInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PosClosingEntryTaxesSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
