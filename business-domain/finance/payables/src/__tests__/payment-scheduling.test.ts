import { describe, expect, it } from 'vitest';
import { buildPaymentBatch } from '../calculators/payment-scheduling';

import type { PaymentScheduleEntry } from '../calculators/payment-scheduling';

describe('buildPaymentBatch', () => {
  const invoices: PaymentScheduleEntry[] = [
    { vendorId: 'v1', invoiceId: 'i1', amountMinor: 5000, dueDateIso: '2025-03-01', priority: 'high' },
    { vendorId: 'v2', invoiceId: 'i2', amountMinor: 3000, dueDateIso: '2025-03-05', priority: 'medium' },
    { vendorId: 'v3', invoiceId: 'i3', amountMinor: 2000, dueDateIso: '2025-03-02', priority: 'high' },
    { vendorId: 'v4', invoiceId: 'i4', amountMinor: 1000, dueDateIso: '2025-03-10', priority: 'low' },
  ];

  it('selects high-priority invoices first', () => {
    const batch = buildPaymentBatch(invoices, 8000).result;
    expect(batch.entries[0]?.invoiceId).toBe('i1');
    expect(batch.entries[1]?.invoiceId).toBe('i3');
  });

  it('sorts same-priority by due date ascending', () => {
    const batch = buildPaymentBatch(invoices, 100000).result;
    const highPriority = batch.entries.filter((e) => e.priority === 'high');
    expect(highPriority[0]?.dueDateIso).toBe('2025-03-01');
    expect(highPriority[1]?.dueDateIso).toBe('2025-03-02');
  });

  it('respects budget limit', () => {
    const batch = buildPaymentBatch(invoices, 6000).result;
    expect(batch.totalMinor).toBeLessThanOrEqual(6000);
    expect(batch.count).toBe(2);
  });

  it('returns empty batch for zero budget', () => {
    const batch = buildPaymentBatch(invoices, 0).result;
    expect(batch.entries).toHaveLength(0);
    expect(batch.totalMinor).toBe(0);
    expect(batch.count).toBe(0);
  });

  it('includes all invoices when budget is sufficient', () => {
    const batch = buildPaymentBatch(invoices, 100000).result;
    expect(batch.count).toBe(4);
    expect(batch.totalMinor).toBe(11000);
  });

  it('returns empty batch for empty invoices', () => {
    const batch = buildPaymentBatch([], 10000).result;
    expect(batch.entries).toHaveLength(0);
    expect(batch.totalMinor).toBe(0);
  });

  it('throws on negative budget', () => {
    expect(() => buildPaymentBatch(invoices, -1)).toThrow('non-negative integer');
  });

  it('throws on non-integer budget', () => {
    expect(() => buildPaymentBatch(invoices, 100.5)).toThrow('non-negative integer');
  });

  it('skips invoices that exceed remaining budget', () => {
    const batch = buildPaymentBatch(invoices, 5500).result;
    expect(batch.entries).toHaveLength(1);
    expect(batch.entries[0]?.invoiceId).toBe('i1');
    expect(batch.totalMinor).toBe(5000);
  });
});
