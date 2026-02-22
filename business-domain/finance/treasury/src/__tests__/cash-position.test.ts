import { describe, expect, it } from 'vitest';
import { computeCashPosition } from '../calculators/cash-position';

describe('computeCashPosition', () => {
  it('aggregates multi-currency balances', () => {
    const result = computeCashPosition([
      { accountId: 'a1', currency: 'USD', balanceMinor: 100_000, bankName: 'Bank A' },
      { accountId: 'a2', currency: 'USD', balanceMinor: 50_000, bankName: 'Bank B' },
      { accountId: 'a3', currency: 'EUR', balanceMinor: 75_000, bankName: 'Bank C' },
    ]).result;
    expect(result.byCurrency).toEqual({ USD: 150_000, EUR: 75_000 });
    expect(result.totalMinor).toBe(225_000);
    expect(result.negativeAccounts).toEqual([]);
  });

  it('detects negative accounts', () => {
    const result = computeCashPosition([
      { accountId: 'a1', currency: 'USD', balanceMinor: -5_000, bankName: 'Bank A' },
      { accountId: 'a2', currency: 'USD', balanceMinor: 10_000, bankName: 'Bank B' },
    ]).result;
    expect(result.negativeAccounts).toEqual(['a1']);
    expect(result.totalMinor).toBe(5_000);
  });

  it('handles empty accounts', () => {
    const result = computeCashPosition([]).result;
    expect(result.totalMinor).toBe(0);
    expect(result.negativeAccounts).toEqual([]);
  });

  it('throws on non-integer balance', () => {
    expect(() =>
      computeCashPosition([{ accountId: 'a1', currency: 'USD', balanceMinor: 1.5, bankName: 'X' }]),
    ).toThrow('balanceMinor must be an integer');
  });
});
