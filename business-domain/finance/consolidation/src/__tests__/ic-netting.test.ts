import { describe, expect, it } from 'vitest';
import { computeIcNetting } from '../calculators/ic-netting';

describe('CO-09 — IC Netting', () => {
  it('nets payables vs receivables for a company pair', () => {
    const { result } = computeIcNetting([
      { fromCompanyId: 'A', toCompanyId: 'B', currency: 'USD', amountMinor: 100_000, type: 'payable' },
      { fromCompanyId: 'A', toCompanyId: 'B', currency: 'USD', amountMinor: 60_000, type: 'receivable' },
    ]);
    expect(result.nettedPairs).toHaveLength(1);
    expect(result.nettedPairs[0].netSettlementMinor).toBe(40_000);
    expect(result.totalGrossMinor).toBe(160_000);
    expect(result.totalNetMinor).toBe(40_000);
    expect(result.reductionPct).toBe(75);
  });

  it('handles multiple currency pairs', () => {
    const { result } = computeIcNetting([
      { fromCompanyId: 'A', toCompanyId: 'B', currency: 'USD', amountMinor: 50_000, type: 'payable' },
      { fromCompanyId: 'A', toCompanyId: 'B', currency: 'EUR', amountMinor: 30_000, type: 'payable' },
      { fromCompanyId: 'A', toCompanyId: 'B', currency: 'USD', amountMinor: 50_000, type: 'receivable' },
    ]);
    expect(result.nettedPairs).toHaveLength(2);
  });

  it('returns zero direction when balanced', () => {
    const { result } = computeIcNetting([
      { fromCompanyId: 'X', toCompanyId: 'Y', currency: 'GBP', amountMinor: 10_000, type: 'payable' },
      { fromCompanyId: 'X', toCompanyId: 'Y', currency: 'GBP', amountMinor: 10_000, type: 'receivable' },
    ]);
    expect(result.nettedPairs[0].direction).toBe('zero');
    expect(result.nettedPairs[0].netSettlementMinor).toBe(0);
  });

  it('returns CalculatorResult shape', () => {
    const res = computeIcNetting([
      { fromCompanyId: 'A', toCompanyId: 'B', currency: 'USD', amountMinor: 1000, type: 'payable' },
    ]);
    expect(res).toHaveProperty('result');
    expect(res).toHaveProperty('inputs');
    expect(res).toHaveProperty('explanation');
  });

  it('throws on empty balances', () => {
    expect(() => computeIcNetting([])).toThrow('At least one IC balance');
  });

  it('throws on negative amount', () => {
    expect(() => computeIcNetting([
      { fromCompanyId: 'A', toCompanyId: 'B', currency: 'USD', amountMinor: -100, type: 'payable' },
    ])).toThrow('non-negative');
  });
});
