import { describe, it, expect } from 'vitest';
import { BankAccountSchema, BankAccountInsertSchema } from '../types/bank-account.js';

describe('BankAccount Zod validation', () => {
  const validSample = {
      "id": "TEST-BankAccount-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "account_name": "Sample Account Name",
      "account": "LINK-account-001",
      "bank": "LINK-bank-001",
      "account_type": "LINK-account_type-001",
      "account_subtype": "LINK-account_subtype-001",
      "disabled": "0",
      "is_default": "0",
      "is_company_account": "0",
      "company": "LINK-company-001",
      "party_type": "LINK-party_type-001",
      "party": "LINK-party-001",
      "iban": "DE89370400440532013000",
      "branch_code": "Sample Branch Code",
      "bank_account_no": "Sample Bank Account No",
      "address_html": "Sample text for address_html",
      "contact_html": "Sample text for contact_html",
      "integration_id": "Sample Integration ID",
      "last_integration_date": "2024-01-15",
      "mask": "Sample Mask"
  };

  it('validates a correct Bank Account object', () => {
    const result = BankAccountSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = BankAccountInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "account_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).account_name;
    const result = BankAccountSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = BankAccountSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
