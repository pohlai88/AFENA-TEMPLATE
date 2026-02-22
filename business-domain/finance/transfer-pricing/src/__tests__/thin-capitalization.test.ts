import { describe, expect, it } from 'vitest';
import { evaluateThinCapitalization } from '../calculators/thin-capitalization';

describe('evaluateThinCapitalization', () => {
  it('allows full deduction within limits', () => {
    const r = evaluateThinCapitalization({ entityId: 'E1', totalDebtMinor: 100000, totalEquityMinor: 200000, interestExpenseMinor: 5000, ebitdaMinor: 50000, maxDebtEquityRatio: 3, maxInterestToEbitdaPct: 30 });
    expect(r.result.debtEquityBreached).toBe(false);
    expect(r.result.interestCapBreached).toBe(false);
    expect(r.result.disallowedInterestMinor).toBe(0);
  });

  it('disallows interest exceeding EBITDA cap', () => {
    const r = evaluateThinCapitalization({ entityId: 'E2', totalDebtMinor: 500000, totalEquityMinor: 100000, interestExpenseMinor: 40000, ebitdaMinor: 100000, maxDebtEquityRatio: 3, maxInterestToEbitdaPct: 30 });
    expect(r.result.interestCapBreached).toBe(true);
    expect(r.result.disallowedInterestMinor).toBe(10000);
  });

  it('flags D/E breach', () => {
    const r = evaluateThinCapitalization({ entityId: 'E3', totalDebtMinor: 400000, totalEquityMinor: 100000, interestExpenseMinor: 5000, ebitdaMinor: 100000, maxDebtEquityRatio: 3, maxInterestToEbitdaPct: 30 });
    expect(r.result.debtEquityBreached).toBe(true);
  });

  it('throws on zero equity', () => {
    expect(() => evaluateThinCapitalization({ entityId: 'E4', totalDebtMinor: 100000, totalEquityMinor: 0, interestExpenseMinor: 5000, ebitdaMinor: 50000, maxDebtEquityRatio: 3, maxInterestToEbitdaPct: 30 })).toThrow();
  });
});
