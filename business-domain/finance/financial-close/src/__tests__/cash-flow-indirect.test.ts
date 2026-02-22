import { describe, expect, it } from 'vitest';
import { deriveCashFlowFromTb } from '../calculators/cash-flow-indirect';

describe('deriveCashFlowFromTb', () => {
  it('derives cash flow from TB movements', () => {
    const movements = [
      { accountCode: '1200', accountName: 'Depreciation', classification: 'non_cash' as const, openingMinor: 0, closingMinor: 20000 },
      { accountCode: '2100', accountName: 'Capex', classification: 'investing' as const, openingMinor: 0, closingMinor: -50000 },
      { accountCode: '3100', accountName: 'Loan', classification: 'financing' as const, openingMinor: 0, closingMinor: 30000 },
    ];
    const r = deriveCashFlowFromTb(movements, 100000);
    expect(r.result.operatingMinor).toBe(120000);
    expect(r.result.investingMinor).toBe(-50000);
    expect(r.result.financingMinor).toBe(30000);
    expect(r.result.netCashChangeMinor).toBe(100000);
    expect(r.result.nonCashItems).toHaveLength(1);
  });

  it('throws on empty movements', () => {
    expect(() => deriveCashFlowFromTb([], 0)).toThrow('at least one');
  });
});
