import { describe, expect, it } from 'vitest';
import { computeGainLoss, convertAmount } from '../calculators/fx-convert';

describe('convertAmount', () => {
  it('converts MYR to USD at rate 0.22', () => {
    const result = convertAmount(10000, '0.22', 'MYR', 'USD').result;
    expect(result.fromMinor).toBe(10000);
    expect(result.toMinor).toBe(2200);
    expect(result.fromCurrency).toBe('MYR');
    expect(result.toCurrency).toBe('USD');
  });

  it('returns identity for same currency', () => {
    const result = convertAmount(5000, '1.5', 'MYR', 'MYR').result;
    expect(result.toMinor).toBe(5000);
    expect(result.rate).toBe('1');
  });

  it('rounds half-up', () => {
    const result = convertAmount(1001, '0.225', 'MYR', 'USD').result;
    expect(result.toMinor).toBe(225);
  });

  it('throws on non-integer amount', () => {
    expect(() => convertAmount(100.5, '1.0', 'MYR', 'USD')).toThrow('integer minor units');
  });

  it('throws on negative amount', () => {
    expect(() => convertAmount(-100, '1.0', 'MYR', 'USD')).toThrow('non-negative');
  });

  it('throws on zero rate', () => {
    expect(() => convertAmount(100, '0', 'MYR', 'USD')).toThrow('finite and > 0');
  });

  it('throws on negative rate', () => {
    expect(() => convertAmount(100, '-1.5', 'MYR', 'USD')).toThrow('finite and > 0');
  });
});

describe('computeGainLoss', () => {
  it('detects gain when revalued > original', () => {
    const result = computeGainLoss(10000, 11000).result;
    expect(result.gainLossMinor).toBe(1000);
    expect(result.isGain).toBe(true);
  });

  it('detects loss when revalued < original', () => {
    const result = computeGainLoss(10000, 9500).result;
    expect(result.gainLossMinor).toBe(500);
    expect(result.isGain).toBe(false);
  });

  it('returns zero gain for no change', () => {
    const result = computeGainLoss(10000, 10000).result;
    expect(result.gainLossMinor).toBe(0);
    expect(result.isGain).toBe(true);
  });
});
