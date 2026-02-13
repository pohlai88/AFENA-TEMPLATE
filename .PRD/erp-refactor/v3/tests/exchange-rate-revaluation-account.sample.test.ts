import { describe, it, expect } from 'vitest';
import { ExchangeRateRevaluationAccountSchema, ExchangeRateRevaluationAccountInsertSchema } from '../types/exchange-rate-revaluation-account.js';

describe('ExchangeRateRevaluationAccount Zod validation', () => {
  const validSample = {
      "id": "TEST-ExchangeRateRevaluationAccount-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "account": "LINK-account-001",
      "party_type": "LINK-party_type-001",
      "party": "LINK-party-001",
      "account_currency": "LINK-account_currency-001",
      "balance_in_account_currency": 100,
      "new_balance_in_account_currency": 100,
      "current_exchange_rate": 1,
      "new_exchange_rate": 1,
      "balance_in_base_currency": 100,
      "new_balance_in_base_currency": 100,
      "gain_loss": 100,
      "zero_balance": "0"
  };

  it('validates a correct Exchange Rate Revaluation Account object', () => {
    const result = ExchangeRateRevaluationAccountSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ExchangeRateRevaluationAccountInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "account" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).account;
    const result = ExchangeRateRevaluationAccountSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ExchangeRateRevaluationAccountSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
