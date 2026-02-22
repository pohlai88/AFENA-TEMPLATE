import { describe, expect, it } from 'vitest';
import { computeCashFlowIndirect } from '../calculators/cash-flow-statement';

describe('computeCashFlowIndirect', () => {
  it('computes cash flow sections', () => {
    const r = computeCashFlowIndirect({
      netIncomeMinor: 100000, depreciationMinor: 20000, amortizationMinor: 5000,
      changeInReceivablesMinor: 10000, changeInPayablesMinor: 5000, changeInInventoryMinor: 3000, otherOperatingMinor: 0,
      capexMinor: 50000, investmentPurchasesMinor: 10000, investmentProceedsMinor: 5000,
      debtIssuedMinor: 30000, debtRepaidMinor: 20000, dividendsPaidMinor: 15000, equityIssuedMinor: 0,
    });
    expect(r.result.operatingMinor).toBe(117000);
    expect(r.result.investingMinor).toBe(-55000);
    expect(r.result.financingMinor).toBe(-5000);
    expect(r.result.netChangeMinor).toBe(57000);
  });

  it('handles zero inputs', () => {
    const r = computeCashFlowIndirect({
      netIncomeMinor: 0, depreciationMinor: 0, amortizationMinor: 0,
      changeInReceivablesMinor: 0, changeInPayablesMinor: 0, changeInInventoryMinor: 0, otherOperatingMinor: 0,
      capexMinor: 0, investmentPurchasesMinor: 0, investmentProceedsMinor: 0,
      debtIssuedMinor: 0, debtRepaidMinor: 0, dividendsPaidMinor: 0, equityIssuedMinor: 0,
    });
    expect(r.result.netChangeMinor).toBe(0);
  });
});
