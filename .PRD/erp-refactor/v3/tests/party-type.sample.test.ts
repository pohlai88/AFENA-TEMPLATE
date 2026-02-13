import { describe, it, expect } from 'vitest';
import { PartyTypeSchema, PartyTypeInsertSchema } from '../types/party-type.js';

describe('PartyType Zod validation', () => {
  const validSample = {
      "id": "TEST-PartyType-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "party_type": "LINK-party_type-001",
      "account_type": "Payable"
  };

  it('validates a correct Party Type object', () => {
    const result = PartyTypeSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PartyTypeInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "party_type" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).party_type;
    const result = PartyTypeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PartyTypeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
