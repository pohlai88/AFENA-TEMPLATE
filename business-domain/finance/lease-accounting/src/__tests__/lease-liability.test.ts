import { describe, expect, it } from 'vitest';
import { computeLeaseLiability } from '../calculators/lease-liability';

describe('computeLeaseLiability', () => {
  it('zero discount rate — PV equals total payments', () => {
    const r = computeLeaseLiability(
      [
        { periodNumber: 1, amountMinor: 10_000 },
        { periodNumber: 2, amountMinor: 10_000 },
        { periodNumber: 3, amountMinor: 10_000 },
      ],
      0,
    ).result;
    expect(r.presentValueMinor).toBe(30_000);
    expect(r.totalPaymentsMinor).toBe(30_000);
    expect(r.interestMinor).toBe(0);
    expect(r.schedule).toHaveLength(3);
  });

  it('positive discount rate — PV < total payments', () => {
    const r = computeLeaseLiability(
      [
        { periodNumber: 1, amountMinor: 10_000 },
        { periodNumber: 2, amountMinor: 10_000 },
      ],
      0.12,
    ).result;
    expect(r.presentValueMinor).toBeLessThan(r.totalPaymentsMinor);
    expect(r.interestMinor).toBeGreaterThan(0);
  });

  it('schedule has correct number of entries', () => {
    const r = computeLeaseLiability(
      [
        { periodNumber: 1, amountMinor: 5_000 },
        { periodNumber: 2, amountMinor: 5_000 },
        { periodNumber: 3, amountMinor: 5_000 },
        { periodNumber: 4, amountMinor: 5_000 },
      ],
      0.06,
    ).result;
    expect(r.schedule).toHaveLength(4);
    expect(r.schedule[3].closingMinor).toBeGreaterThanOrEqual(0);
  });

  it('throws on empty payments', () => {
    expect(() => computeLeaseLiability([], 0.05)).toThrow('payments must not be empty');
  });

  it('throws on negative discount rate', () => {
    expect(() =>
      computeLeaseLiability([{ periodNumber: 1, amountMinor: 10_000 }], -0.01),
    ).toThrow('annualDiscountRate');
  });

  it('throws on non-positive payment', () => {
    expect(() =>
      computeLeaseLiability([{ periodNumber: 1, amountMinor: 0 }], 0.05),
    ).toThrow('amountMinor');
  });
});
