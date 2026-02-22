import { describe, expect, it } from 'vitest';
import { generateSegmentReport } from '../calculators/segment-reporting';

describe('generateSegmentReport', () => {
  const segments = [
    { segmentId: 'S1', name: 'Retail', revenueExternalMinor: 50000, revenueInterSegmentMinor: 5000, profitLossMinor: 10000, assetsMinor: 80000, liabilitiesMinor: 30000 },
    { segmentId: 'S2', name: 'Wholesale', revenueExternalMinor: 40000, revenueInterSegmentMinor: 2000, profitLossMinor: 8000, assetsMinor: 60000, liabilitiesMinor: 20000 },
    { segmentId: 'S3', name: 'Other', revenueExternalMinor: 5000, revenueInterSegmentMinor: 0, profitLossMinor: 500, assetsMinor: 5000, liabilitiesMinor: 2000 },
  ];

  it('identifies reportable segments by 10% threshold', () => {
    const r = generateSegmentReport(segments);
    expect(r.result.reportableCount).toBe(2);
  });

  it('computes coverage percentage', () => {
    const r = generateSegmentReport(segments);
    expect(r.result.coveragePct).toBeGreaterThanOrEqual(75);
  });

  it('throws on empty segments', () => {
    expect(() => generateSegmentReport([])).toThrow();
  });
});
