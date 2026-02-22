import { describe, expect, it } from 'vitest';
import { valuePortfolio } from '../calculators/investment-portfolio';
import type { InvestmentHolding } from '../calculators/investment-portfolio';

const holdings: InvestmentHolding[] = [
  { holdingId: 'h1', instrumentName: 'Gov Bond A', classification: 'AC', nominalMinor: 1000000, costMinor: 980000, currentFairValueMinor: 990000, accruedInterestMinor: 5000, currency: 'MYR' },
  { holdingId: 'h2', instrumentName: 'Equity Fund B', classification: 'FVTPL', nominalMinor: 500000, costMinor: 500000, currentFairValueMinor: 550000, accruedInterestMinor: 0, currency: 'MYR' },
  { holdingId: 'h3', instrumentName: 'Corp Bond C', classification: 'FVOCI', nominalMinor: 800000, costMinor: 800000, currentFairValueMinor: 780000, accruedInterestMinor: 8000, currency: 'USD' },
];

describe('valuePortfolio', () => {
  it('computes unrealised gain/loss per holding', () => {
    const { result } = valuePortfolio(holdings);
    const h2 = result.holdings.find((h) => h.holdingId === 'h2')!;
    expect(h2.unrealisedGainLossMinor).toBe(50000);
  });

  it('assigns correct gain/loss recognition', () => {
    const { result } = valuePortfolio(holdings);
    expect(result.holdings.find((h) => h.classification === 'AC')!.gainLossRecognition).toBe('none');
    expect(result.holdings.find((h) => h.classification === 'FVTPL')!.gainLossRecognition).toBe('P&L');
    expect(result.holdings.find((h) => h.classification === 'FVOCI')!.gainLossRecognition).toBe('OCI');
  });

  it('computes portfolio totals', () => {
    const { result } = valuePortfolio(holdings);
    expect(result.totalCostMinor).toBe(2280000);
    expect(result.totalFairValueMinor).toBe(2320000);
    expect(result.totalAccruedInterestMinor).toBe(13000);
  });

  it('groups by classification', () => {
    const { result } = valuePortfolio(holdings);
    expect(result.byClassification['AC']!.count).toBe(1);
    expect(result.byClassification['FVTPL']!.count).toBe(1);
  });

  it('throws for empty holdings', () => {
    expect(() => valuePortfolio([])).toThrow('at least one holding');
  });
});
