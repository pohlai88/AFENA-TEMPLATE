import { describe, it, expect } from 'vitest';
import { BankSchema, BankInsertSchema } from '../types/bank.js';

describe('Bank Zod validation', () => {
  const validSample = {
      "id": "TEST-Bank-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "bank_name": "Sample Bank Name",
      "swift_number": "Sample SWIFT number",
      "website": "Sample Website",
      "address_html": "Sample text for address_html",
      "contact_html": "Sample text for contact_html",
      "plaid_access_token": "Sample Plaid Access Token"
  };

  it('validates a correct Bank object', () => {
    const result = BankSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = BankInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "bank_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).bank_name;
    const result = BankSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = BankSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
