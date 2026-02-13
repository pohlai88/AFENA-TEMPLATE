import { describe, it, expect } from 'vitest';
import { BankReconciliationToolSchema, BankReconciliationToolInsertSchema } from '../types/bank-reconciliation-tool.js';

describe('BankReconciliationTool Zod validation', () => {
  const validSample = {
      "id": "TEST-BankReconciliationTool-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "company": "LINK-company-001",
      "bank_account": "LINK-bank_account-001",
      "bank_statement_from_date": "2024-01-15",
      "bank_statement_to_date": "2024-01-15",
      "from_reference_date": "2024-01-15",
      "to_reference_date": "2024-01-15",
      "filter_by_reference_date": "0",
      "account_currency": "LINK-account_currency-001",
      "account_opening_balance": 100,
      "bank_statement_closing_balance": 100,
      "reconciliation_tool_cards": "Sample text for reconciliation_tool_cards",
      "reconciliation_tool_dt": "Sample text for reconciliation_tool_dt",
      "no_bank_transactions": "Sample text for no_bank_transactions"
  };

  it('validates a correct Bank Reconciliation Tool object', () => {
    const result = BankReconciliationToolSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = BankReconciliationToolInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = BankReconciliationToolSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
