import { describe, it, expect } from 'vitest';
import { JournalEntryTemplateAccountSchema, JournalEntryTemplateAccountInsertSchema } from '../types/journal-entry-template-account.js';

describe('JournalEntryTemplateAccount Zod validation', () => {
  const validSample = {
      "id": "TEST-JournalEntryTemplateAccount-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "account": "LINK-account-001",
      "party_type": "LINK-party_type-001",
      "party": "LINK-party-001",
      "cost_center": "LINK-cost_center-001",
      "project": "LINK-project-001"
  };

  it('validates a correct Journal Entry Template Account object', () => {
    const result = JournalEntryTemplateAccountSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = JournalEntryTemplateAccountInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "account" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).account;
    const result = JournalEntryTemplateAccountSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = JournalEntryTemplateAccountSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
