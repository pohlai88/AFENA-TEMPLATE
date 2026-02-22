import { describe, expect, it } from 'vitest';
import { computeCreditExposure } from '../calculators/credit-exposure';

describe('computeCreditExposure', () => {
  it('aggregates invoices and orders', () => {
    const r = computeCreditExposure(
      [
        { invoiceId: 'i1', outstandingMinor: 30_000, isOverdue: false },
        { invoiceId: 'i2', outstandingMinor: 20_000, isOverdue: true },
      ],
      [{ orderId: 'o1', amountMinor: 10_000 }],
    ).result;
    expect(r.totalExposureMinor).toBe(60_000);
    expect(r.invoiceExposureMinor).toBe(50_000);
    expect(r.orderExposureMinor).toBe(10_000);
    expect(r.overdueMinor).toBe(20_000);
  });

  it('handles empty inputs', () => {
    const r = computeCreditExposure([], []).result;
    expect(r.totalExposureMinor).toBe(0);
    expect(r.overdueMinor).toBe(0);
  });

  it('invoices only', () => {
    const r = computeCreditExposure(
      [{ invoiceId: 'i1', outstandingMinor: 50_000, isOverdue: true }],
      [],
    ).result;
    expect(r.totalExposureMinor).toBe(50_000);
    expect(r.orderExposureMinor).toBe(0);
    expect(r.overdueMinor).toBe(50_000);
  });
});
