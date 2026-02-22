import { describe, expect, it } from 'vitest';
import { computeAging } from '../calculators/aging';

describe('computeAging', () => {
  const asOf = '2025-03-15';

  it('returns empty buckets for no invoices', () => {
    const report = computeAging([], asOf).result;
    expect(report.totalOutstandingMinor).toBe(0);
    expect(report.totalOverdueMinor).toBe(0);
    expect(report.buckets).toHaveLength(5);
    report.buckets.forEach((b) => {
      expect(b.totalMinor).toBe(0);
      expect(b.count).toBe(0);
    });
  });

  it('places current (not overdue) invoices in Current bucket', () => {
    const invoices = [{ outstandingMinor: 10000, dueDateIso: '2025-03-20' }];
    const report = computeAging(invoices, asOf).result;
    expect(report.totalOutstandingMinor).toBe(10000);
    expect(report.totalOverdueMinor).toBe(0);
    const current = report.buckets.find((b) => b.label === 'Current');
    expect(current?.totalMinor).toBe(10000);
    expect(current?.count).toBe(1);
  });

  it('places 15-day overdue invoice in 1-30 bucket', () => {
    const invoices = [{ outstandingMinor: 5000, dueDateIso: '2025-03-01' }];
    const report = computeAging(invoices, '2025-03-16').result;
    expect(report.totalOverdueMinor).toBe(5000);
    const bucket = report.buckets.find((b) => b.label === '1-30');
    expect(bucket?.totalMinor).toBe(5000);
  });

  it('places 45-day overdue invoice in 31-60 bucket', () => {
    const invoices = [{ outstandingMinor: 7500, dueDateIso: '2025-01-30' }];
    const report = computeAging(invoices, '2025-03-16').result;
    expect(report.totalOverdueMinor).toBe(7500);
    const bucket = report.buckets.find((b) => b.label === '31-60');
    expect(bucket?.totalMinor).toBe(7500);
  });

  it('places 75-day overdue invoice in 61-90 bucket', () => {
    const invoices = [{ outstandingMinor: 3000, dueDateIso: '2025-01-01' }];
    const report = computeAging(invoices, '2025-03-17').result;
    expect(report.totalOverdueMinor).toBe(3000);
    const bucket = report.buckets.find((b) => b.label === '61-90');
    expect(bucket?.totalMinor).toBe(3000);
  });

  it('places 120-day overdue invoice in 90+ bucket', () => {
    const invoices = [{ outstandingMinor: 20000, dueDateIso: '2024-11-15' }];
    const report = computeAging(invoices, asOf).result;
    const bucket = report.buckets.find((b) => b.label === '90+');
    expect(bucket?.totalMinor).toBe(20000);
    expect(bucket?.count).toBe(1);
  });

  it('distributes multiple invoices across buckets', () => {
    const invoices = [
      { outstandingMinor: 1000, dueDateIso: '2025-03-20' },
      { outstandingMinor: 2000, dueDateIso: '2025-03-01' },
      { outstandingMinor: 3000, dueDateIso: '2025-01-15' },
      { outstandingMinor: 4000, dueDateIso: '2024-11-01' },
    ];
    const report = computeAging(invoices, asOf).result;
    expect(report.totalOutstandingMinor).toBe(10000);
    expect(report.totalOverdueMinor).toBe(9000);
  });

  it('throws on non-integer outstandingMinor', () => {
    const invoices = [{ outstandingMinor: 100.5, dueDateIso: '2025-03-01' }];
    expect(() => computeAging(invoices, asOf)).toThrow('integer minor units');
  });
});
