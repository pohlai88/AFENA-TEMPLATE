import { describe, expect, it } from 'vitest';

import { computeTrialBalance } from '../calculators/trial-balance-computation';

describe('computeTrialBalance', () => {
  it('produces balanced trial balance', () => {
    const { result } = computeTrialBalance({
      periodKey: '2025-P06',
      lines: [
        { accountId: '1000', accountName: 'Cash', debitMinor: 100_000, creditMinor: 0 },
        { accountId: '2000', accountName: 'Revenue', debitMinor: 0, creditMinor: 80_000 },
        { accountId: '3000', accountName: 'Expenses', debitMinor: 30_000, creditMinor: 0 },
        { accountId: '4000', accountName: 'Equity', debitMinor: 0, creditMinor: 50_000 },
      ],
    });
    expect(result.totalDebitsMinor).toBe(130_000);
    expect(result.totalCreditsMinor).toBe(130_000);
    expect(result.isBalanced).toBe(true);
    expect(result.differenceMinor).toBe(0);
    expect(result.lines).toHaveLength(4);
  });

  it('detects unbalanced trial balance', () => {
    const { result } = computeTrialBalance({
      periodKey: '2025-P06',
      lines: [
        { accountId: '1000', accountName: 'Cash', debitMinor: 100_000, creditMinor: 0 },
        { accountId: '2000', accountName: 'Revenue', debitMinor: 0, creditMinor: 80_000 },
      ],
    });
    expect(result.isBalanced).toBe(false);
    expect(result.differenceMinor).toBe(20_000);
  });

  it('aggregates lines by account', () => {
    const { result } = computeTrialBalance({
      periodKey: '2025-P06',
      lines: [
        { accountId: '1000', accountName: 'Cash', debitMinor: 50_000, creditMinor: 0 },
        { accountId: '1000', accountName: 'Cash', debitMinor: 30_000, creditMinor: 0 },
      ],
    });
    expect(result.lines).toHaveLength(1);
    expect(result.lines[0].debitMinor).toBe(80_000);
  });

  it('throws on empty lines', () => {
    expect(() => computeTrialBalance({ periodKey: '2025-P06', lines: [] }))
      .toThrow('At least one journal line');
  });
});
