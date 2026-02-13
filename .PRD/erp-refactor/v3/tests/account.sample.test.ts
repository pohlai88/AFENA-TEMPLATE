import { describe, it, expect } from 'vitest';
import { AccountSchema, AccountInsertSchema } from '../types/account.js';

describe('Account Zod validation', () => {
  const validSample = {
      "id": "TEST-Account-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "disabled": "0",
      "account_name": "Sample Account Name",
      "account_number": "Sample Account Number",
      "is_group": "0",
      "company": "LINK-company-001",
      "root_type": "Asset",
      "report_type": "Balance Sheet",
      "account_currency": "LINK-account_currency-001",
      "parent_account": "LINK-parent_account-001",
      "account_category": "LINK-account_category-001",
      "account_type": "Accumulated Depreciation",
      "tax_rate": 1,
      "freeze_account": "No",
      "balance_must_be": "Debit",
      "lft": 1,
      "rgt": 1,
      "old_parent": "Sample Old Parent",
      "include_in_gross": "0"
  };

  it('validates a correct Account object', () => {
    const result = AccountSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = AccountInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "account_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).account_name;
    const result = AccountSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = AccountSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
