import { describe, it, expect } from 'vitest';
import { BankTransactionSchema, BankTransactionInsertSchema } from '../types/bank-transaction.js';

describe('BankTransaction Zod validation', () => {
  const validSample = {
      "id": "TEST-BankTransaction-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "naming_series": "ACC-BTN-.YYYY.-",
      "date": "2024-01-15",
      "status": "Pending",
      "bank_account": "LINK-bank_account-001",
      "company": "LINK-company-001",
      "amended_from": "LINK-amended_from-001",
      "deposit": 100,
      "withdrawal": 100,
      "currency": "LINK-currency-001",
      "description": "Sample text for description",
      "reference_number": "Sample text for reference_number",
      "transaction_id": "Sample Transaction ID",
      "transaction_type": "Sample Transaction Type",
      "allocated_amount": 100,
      "unallocated_amount": 100,
      "party_type": "LINK-party_type-001",
      "party": "LINK-party-001",
      "bank_party_name": "Sample Party Name/Account Holder (Bank Statement)",
      "bank_party_account_number": "Sample Party Account No. (Bank Statement)",
      "bank_party_iban": "DE89370400440532013000",
      "included_fee": 100,
      "excluded_fee": 100
  };

  it('validates a correct Bank Transaction object', () => {
    const result = BankTransactionSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = BankTransactionInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "naming_series" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).naming_series;
    const result = BankTransactionSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = BankTransactionSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
