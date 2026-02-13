import { describe, it, expect } from 'vitest';
import { ExchangeRateRevaluationSchema, ExchangeRateRevaluationInsertSchema } from '../types/exchange-rate-revaluation.js';

describe('ExchangeRateRevaluation Zod validation', () => {
  const validSample = {
      "id": "TEST-ExchangeRateRevaluation-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "posting_date": "Today",
      "rounding_loss_allowance": "0.05",
      "company": "LINK-company-001",
      "gain_loss_unbooked": 100,
      "gain_loss_booked": 100,
      "total_gain_loss": 100,
      "amended_from": "LINK-amended_from-001"
  };

  it('validates a correct Exchange Rate Revaluation object', () => {
    const result = ExchangeRateRevaluationSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ExchangeRateRevaluationInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "posting_date" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).posting_date;
    const result = ExchangeRateRevaluationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ExchangeRateRevaluationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
