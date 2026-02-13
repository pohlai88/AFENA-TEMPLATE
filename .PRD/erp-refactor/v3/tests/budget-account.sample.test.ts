import { describe, it, expect } from 'vitest';
import { BudgetAccountSchema, BudgetAccountInsertSchema } from '../types/budget-account.js';

describe('BudgetAccount Zod validation', () => {
  const validSample = {
      "id": "TEST-BudgetAccount-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "account": "LINK-account-001",
      "budget_amount": 100
  };

  it('validates a correct Budget Account object', () => {
    const result = BudgetAccountSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = BudgetAccountInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "account" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).account;
    const result = BudgetAccountSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = BudgetAccountSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
