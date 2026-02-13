import { describe, it, expect } from 'vitest';
import { UaeVatAccountSchema, UaeVatAccountInsertSchema } from '../types/uae-vat-account.js';

describe('UaeVatAccount Zod validation', () => {
  const validSample = {
      "id": "TEST-UaeVatAccount-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "account": "LINK-account-001"
  };

  it('validates a correct UAE VAT Account object', () => {
    const result = UaeVatAccountSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = UaeVatAccountInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = UaeVatAccountSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
