import { describe, expect, it } from 'vitest';
import { allocateTransactionPrice } from '../calculators/performance-obligation';

describe('allocateTransactionPrice', () => {
  it('proportional allocation sums to transaction price', () => {
    const result = allocateTransactionPrice(100_000, [
      { id: 'a', standalonePriceMinor: 60_000, description: 'License' },
      { id: 'b', standalonePriceMinor: 40_000, description: 'Support' },
    ]).result;
    expect(result).toHaveLength(2);
    const total = result.reduce((s, r) => s + r.allocatedMinor, 0);
    expect(total).toBe(100_000);
    expect(result[0].allocatedMinor).toBe(60_000);
    expect(result[1].allocatedMinor).toBe(40_000);
  });

  it('handles single obligation', () => {
    const result = allocateTransactionPrice(50_000, [
      { id: 'x', standalonePriceMinor: 30_000, description: 'Only' },
    ]).result;
    expect(result[0].allocatedMinor).toBe(50_000);
  });

  it('handles rounding remainder in last obligation', () => {
    const result = allocateTransactionPrice(100_000, [
      { id: 'a', standalonePriceMinor: 33_333, description: 'A' },
      { id: 'b', standalonePriceMinor: 33_333, description: 'B' },
      { id: 'c', standalonePriceMinor: 33_334, description: 'C' },
    ]).result;
    const total = result.reduce((s, r) => s + r.allocatedMinor, 0);
    expect(total).toBe(100_000);
  });

  it('throws on empty obligations', () => {
    expect(() => allocateTransactionPrice(100_000, [])).toThrow('obligations must not be empty');
  });

  it('throws on zero transaction price', () => {
    expect(() =>
      allocateTransactionPrice(0, [{ id: 'a', standalonePriceMinor: 100, description: 'A' }]),
    ).toThrow('transactionPriceMinor');
  });
});
