import { describe, it, expect } from 'vitest';
import { PartySpecificItemSchema, PartySpecificItemInsertSchema } from '../types/party-specific-item.js';

describe('PartySpecificItem Zod validation', () => {
  const validSample = {
      "id": "TEST-PartySpecificItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "party_type": "Customer",
      "party": "LINK-party-001",
      "restrict_based_on": "Item",
      "based_on_value": "LINK-based_on_value-001"
  };

  it('validates a correct Party Specific Item object', () => {
    const result = PartySpecificItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PartySpecificItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "party_type" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).party_type;
    const result = PartySpecificItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PartySpecificItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
