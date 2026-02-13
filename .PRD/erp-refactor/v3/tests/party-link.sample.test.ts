import { describe, it, expect } from 'vitest';
import { PartyLinkSchema, PartyLinkInsertSchema } from '../types/party-link.js';

describe('PartyLink Zod validation', () => {
  const validSample = {
      "id": "TEST-PartyLink-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "primary_role": "LINK-primary_role-001",
      "secondary_role": "LINK-secondary_role-001",
      "primary_party": "LINK-primary_party-001",
      "secondary_party": "LINK-secondary_party-001"
  };

  it('validates a correct Party Link object', () => {
    const result = PartyLinkSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PartyLinkInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "primary_role" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).primary_role;
    const result = PartyLinkSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PartyLinkSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
