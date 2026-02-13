import { describe, it, expect } from 'vitest';
import { SouthAfricaVatAccountSchema, SouthAfricaVatAccountInsertSchema } from '../types/south-africa-vat-account.js';

describe('SouthAfricaVatAccount Zod validation', () => {
  const validSample = {
      "id": "TEST-SouthAfricaVatAccount-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "account": "LINK-account-001"
  };

  it('validates a correct South Africa VAT Account object', () => {
    const result = SouthAfricaVatAccountSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SouthAfricaVatAccountInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SouthAfricaVatAccountSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
