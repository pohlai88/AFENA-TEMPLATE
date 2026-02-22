import { describe, expect, it } from 'vitest';
import { determineFunctionalCurrency } from '../calculators/functional-currency';
import type { CurrencyIndicator } from '../calculators/functional-currency';

describe('determineFunctionalCurrency', () => {
  it('determines currency with highest weighted score', () => {
    const indicators: CurrencyIndicator[] = [
      { currency: 'MYR', indicatorType: 'revenue', weightMinor: 800000, description: 'Domestic sales' },
      { currency: 'USD', indicatorType: 'revenue', weightMinor: 200000, description: 'Export sales' },
      { currency: 'MYR', indicatorType: 'cost', weightMinor: 600000, description: 'Local labour' },
    ];

    const { result } = determineFunctionalCurrency(indicators);

    expect(result.determinedCurrency).toBe('MYR');
    expect(result.confidence).toBe('high');
  });

  it('gives 2x weight to primary indicators (revenue, cost)', () => {
    const indicators: CurrencyIndicator[] = [
      { currency: 'MYR', indicatorType: 'revenue', weightMinor: 100, description: 'Sales' },
      { currency: 'USD', indicatorType: 'financing', weightMinor: 200, description: 'USD loan' },
    ];

    const { result } = determineFunctionalCurrency(indicators);

    expect(result.determinedCurrency).toBe('MYR');
  });

  it('returns medium confidence when gap is 15-60%', () => {
    const indicators: CurrencyIndicator[] = [
      { currency: 'MYR', indicatorType: 'revenue', weightMinor: 500, description: 'Sales' },
      { currency: 'USD', indicatorType: 'revenue', weightMinor: 300, description: 'Export' },
      { currency: 'SGD', indicatorType: 'cost', weightMinor: 100, description: 'SG costs' },
    ];

    const { result } = determineFunctionalCurrency(indicators);

    expect(result.determinedCurrency).toBe('MYR');
    expect(result.confidence).toBe('medium');
  });

  it('returns low confidence when currencies are close', () => {
    const indicators: CurrencyIndicator[] = [
      { currency: 'MYR', indicatorType: 'revenue', weightMinor: 500, description: 'Sales' },
      { currency: 'USD', indicatorType: 'revenue', weightMinor: 480, description: 'Export' },
    ];

    const { result } = determineFunctionalCurrency(indicators);

    expect(result.confidence).toBe('low');
  });

  it('returns primary indicators for determined currency', () => {
    const indicators: CurrencyIndicator[] = [
      { currency: 'MYR', indicatorType: 'revenue', weightMinor: 800, description: 'Domestic sales' },
      { currency: 'MYR', indicatorType: 'cost', weightMinor: 600, description: 'Local labour' },
      { currency: 'MYR', indicatorType: 'financing', weightMinor: 200, description: 'MYR loan' },
    ];

    const { result } = determineFunctionalCurrency(indicators);

    expect(result.primaryIndicators).toContain('Domestic sales');
    expect(result.primaryIndicators).toContain('Local labour');
    expect(result.primaryIndicators).not.toContain('MYR loan');
  });

  it('returns sorted currency scores with percentages', () => {
    const indicators: CurrencyIndicator[] = [
      { currency: 'MYR', indicatorType: 'revenue', weightMinor: 700, description: 'Sales' },
      { currency: 'USD', indicatorType: 'cost', weightMinor: 300, description: 'Imports' },
    ];

    const { result } = determineFunctionalCurrency(indicators);

    expect(result.currencyScores[0]!.currency).toBe('MYR');
    expect(result.currencyScores[0]!.percentage).toBeGreaterThan(50);
  });

  it('throws for empty indicators', () => {
    expect(() => determineFunctionalCurrency([])).toThrow('At least one currency indicator');
  });

  it('throws for negative weight', () => {
    const bad: CurrencyIndicator[] = [
      { currency: 'MYR', indicatorType: 'revenue', weightMinor: -100, description: 'Bad' },
    ];
    expect(() => determineFunctionalCurrency(bad)).toThrow('Negative weight');
  });

  it('returns explanation with currency and confidence', () => {
    const indicators: CurrencyIndicator[] = [
      { currency: 'MYR', indicatorType: 'revenue', weightMinor: 1000, description: 'Sales' },
    ];

    const calc = determineFunctionalCurrency(indicators);
    expect(calc.explanation).toContain('MYR');
    expect(calc.explanation).toContain('high');
  });
});
