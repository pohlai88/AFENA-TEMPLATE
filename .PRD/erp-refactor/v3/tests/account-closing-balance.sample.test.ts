import { describe, it, expect } from 'vitest';
import { AccountClosingBalanceSchema, AccountClosingBalanceInsertSchema } from '../types/account-closing-balance.js';

describe('AccountClosingBalance Zod validation', () => {
  const validSample = {
      "id": "TEST-AccountClosingBalance-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "closing_date": "2024-01-15",
      "account": "LINK-account-001",
      "cost_center": "LINK-cost_center-001",
      "debit": 100,
      "credit": 100,
      "reporting_currency_exchange_rate": 1,
      "debit_in_reporting_currency": 100,
      "credit_in_reporting_currency": 100,
      "account_currency": "LINK-account_currency-001",
      "debit_in_account_currency": 100,
      "credit_in_account_currency": 100,
      "project": "LINK-project-001",
      "company": "LINK-company-001",
      "finance_book": "LINK-finance_book-001",
      "period_closing_voucher": "LINK-period_closing_voucher-001",
      "is_period_closing_voucher_entry": "0"
  };

  it('validates a correct Account Closing Balance object', () => {
    const result = AccountClosingBalanceSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = AccountClosingBalanceInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = AccountClosingBalanceSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
