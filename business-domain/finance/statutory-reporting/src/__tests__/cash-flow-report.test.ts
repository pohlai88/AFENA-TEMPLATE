import { describe, expect, it } from 'vitest';
import { renderCashFlowStatement } from '../calculators/cash-flow-report';

describe('renderCashFlowStatement', () => {
  it('renders cash flow with all sections', () => {
    const items = [
      { label: 'Net income', section: 'operating' as const, amountMinor: 100000 },
      { label: 'Depreciation', section: 'operating' as const, amountMinor: 20000 },
      { label: 'Capex', section: 'investing' as const, amountMinor: -50000 },
      { label: 'Loan repayment', section: 'financing' as const, amountMinor: -30000 },
    ];
    const r = renderCashFlowStatement(items, 200000);
    expect(r.result.operatingMinor).toBe(120000);
    expect(r.result.investingMinor).toBe(-50000);
    expect(r.result.financingMinor).toBe(-30000);
    expect(r.result.netChangeMinor).toBe(40000);
    expect(r.result.closingCashMinor).toBe(240000);
  });

  it('throws on empty items', () => {
    expect(() => renderCashFlowStatement([], 0)).toThrow('at least one');
  });
});
