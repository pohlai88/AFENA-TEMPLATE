import { describe, expect, it } from 'vitest';
import { computeRecurringInvoiceTax } from '../calculators/recurring-invoice-tax';

describe('SB-09 — Recurring Invoice Tax', () => {
  it('computes tax-exclusive pricing', () => {
    const { result } = computeRecurringInvoiceTax('INV-1', 'US-CA', [
      { lineId: 'L1', description: 'Monthly plan', amountMinor: 10_000, taxRatePct: 10, taxInclusive: false },
    ]);
    expect(result.lines[0].netAmountMinor).toBe(10_000);
    expect(result.lines[0].taxAmountMinor).toBe(1_000);
    expect(result.lines[0].grossAmountMinor).toBe(11_000);
    expect(result.totalTaxMinor).toBe(1_000);
  });

  it('computes tax-inclusive pricing', () => {
    const { result } = computeRecurringInvoiceTax('INV-2', 'DE', [
      { lineId: 'L1', description: 'Annual plan', amountMinor: 11_900, taxRatePct: 19, taxInclusive: true },
    ]);
    expect(result.lines[0].netAmountMinor).toBe(10_000);
    expect(result.lines[0].taxAmountMinor).toBe(1_900);
    expect(result.lines[0].grossAmountMinor).toBe(11_900);
  });

  it('handles multiple lines with different rates', () => {
    const { result } = computeRecurringInvoiceTax('INV-3', 'GB', [
      { lineId: 'L1', description: 'Standard', amountMinor: 10_000, taxRatePct: 20, taxInclusive: false },
      { lineId: 'L2', description: 'Reduced', amountMinor: 5_000, taxRatePct: 5, taxInclusive: false },
    ]);
    expect(result.totalNetMinor).toBe(15_000);
    expect(result.totalTaxMinor).toBe(2_250);
    expect(result.totalGrossMinor).toBe(17_250);
  });

  it('handles zero tax rate', () => {
    const { result } = computeRecurringInvoiceTax('INV-4', 'US', [
      { lineId: 'L1', description: 'Exempt', amountMinor: 5_000, taxRatePct: 0, taxInclusive: false },
    ]);
    expect(result.lines[0].taxAmountMinor).toBe(0);
    expect(result.lines[0].grossAmountMinor).toBe(5_000);
  });

  it('returns CalculatorResult shape', () => {
    const res = computeRecurringInvoiceTax('X', 'US', [
      { lineId: 'L1', description: 'T', amountMinor: 100, taxRatePct: 10, taxInclusive: false },
    ]);
    expect(res).toHaveProperty('result');
    expect(res).toHaveProperty('inputs');
    expect(res).toHaveProperty('explanation');
  });

  it('throws on empty lines', () => {
    expect(() => computeRecurringInvoiceTax('X', 'US', [])).toThrow('At least one invoice line');
  });

  it('throws on negative amount', () => {
    expect(() => computeRecurringInvoiceTax('X', 'US', [
      { lineId: 'L1', description: 'T', amountMinor: -100, taxRatePct: 10, taxInclusive: false },
    ])).toThrow('Negative amount');
  });
});
